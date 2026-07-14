import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrder, WorkOrderStatus } from './entities/work-order.entity';
import { StatusHistory } from './entities/status-history.entity';
import { CreateWorkOrderDto, ChangeStatusDto } from './dto/work-order.dto';
import { ExcelService } from '../common/excel/excel.service';
import { Client } from '../clients/entities/client.entity';
import { Equipment } from '../equipment/entities/equipment.entity';

@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectRepository(WorkOrder)
    private readonly workOrdersRepo: Repository<WorkOrder>,
    @InjectRepository(StatusHistory)
    private readonly historyRepo: Repository<StatusHistory>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(Equipment)
    private readonly equipmentRepo: Repository<Equipment>,
    private readonly excelService: ExcelService,
  ) {}

  private async generateOtNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.workOrdersRepo.count();
    return `OT-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async findAll(status?: WorkOrderStatus): Promise<WorkOrder[]> {
    const where = status ? { status } : {};
    return this.workOrdersRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<WorkOrder> {
    const ot = await this.workOrdersRepo.findOne({ where: { id } });
    if (!ot) throw new NotFoundException(`OT ${id} no encontrada`);
    return ot;
  }

  async getHistory(id: string): Promise<StatusHistory[]> {
    return this.historyRepo.find({
      where: { workOrderId: id },
      order: { changedAt: 'DESC' },
    });
  }

  async create(dto: CreateWorkOrderDto): Promise<WorkOrder> {
    const otNumber = await this.generateOtNumber();
    const ot = this.workOrdersRepo.create({ ...dto, otNumber });
    return this.workOrdersRepo.save(ot);
  }

  async update(id: string, dto: Partial<CreateWorkOrderDto>): Promise<WorkOrder> {
    const ot = await this.findOne(id);
    return this.workOrdersRepo.save({ ...ot, ...dto });
  }

  async changeStatus(
    id: string,
    dto: ChangeStatusDto,
    userId: string,
  ): Promise<WorkOrder> {
    const ot = await this.findOne(id);
    const previousStatus = ot.status;

    // Registrar historial
    const history = this.historyRepo.create({
      workOrderId: id,
      changedById: userId,
      previousStatus,
      newStatus: dto.status,
      notes: dto.notes,
    });
    await this.historyRepo.save(history);

    // Actualizar estado
    ot.status = dto.status;
    if (dto.status === WorkOrderStatus.DESPACHADO) {
      ot.dispatchedAt = new Date();
    }
    return this.workOrdersRepo.save(ot);
  }

  async getStickerData(id: string) {
    const ot = await this.findOne(id);
    await this.workOrdersRepo.save({ ...ot, stickerPrinted: true });
    return {
      otNumber: ot.otNumber,
      internalCode: ot.equipment?.internalCode,
      brand: ot.equipment?.brand,
      model: ot.equipment?.model,
      client: ot.client?.companyName,
      receivedAt: ot.equipment?.receivedAt,
      status: ot.status,
      serviceType: ot.serviceType,
    };
  }

  async getStats() {
    const total = await this.workOrdersRepo.count();
    const byStatus = await this.workOrdersRepo
      .createQueryBuilder('wo')
      .select('wo.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('wo.status')
      .getRawMany();

    return { total, byStatus };
  }

  async exportToExcel(): Promise<Buffer> {
    const orders = await this.workOrdersRepo.find({ relations: { client: true, equipment: true }, order: { createdAt: 'DESC' } });
    const data = orders.map(ot => ({
      OT: ot.otNumber,
      NITCliente: ot.client?.nit || '',
      NombreCliente: ot.client?.companyName || '',
      CodigoEquipo: ot.equipment?.internalCode || '',
      TipoServicio: ot.serviceType,
      Estado: ot.status,
      NotasTecnicas: ot.technicalNotes,
      FechaCreacion: ot.createdAt,
      FechaDespacho: ot.dispatchedAt,
    }));
    return this.excelService.exportToExcel(data, 'OrdenesTrabajo');
  }

  async importFromExcel(buffer: Buffer, userId: string): Promise<{ total: number; created: number; updated: number }> {
    const data = await this.excelService.importFromExcel(buffer);
    let created = 0;
    let updated = 0;

    for (const row of data) {
      const otNumber = row['OT'] ? String(row['OT']).trim() : null;
      const nitCliente = row['NITCliente'] ? String(row['NITCliente']).trim() : null;
      const internalCodeEq = row['CodigoEquipo'] ? String(row['CodigoEquipo']).trim() : null;

      let clientId: string | null = null;
      if (nitCliente) {
        const client = await this.clientRepo.findOne({ where: { nit: nitCliente } });
        if (client) clientId = client.id;
      }

      let equipmentId: string | null = null;
      if (internalCodeEq) {
        const eq = await this.equipmentRepo.findOne({ where: { internalCode: internalCodeEq } });
        if (eq) equipmentId = eq.id;
      }

      let ot: WorkOrder | null = null;
      if (otNumber) {
        ot = await this.workOrdersRepo.findOne({ where: { otNumber } });
      }

      const payload = {
        clientId: clientId || ot?.clientId || undefined,
        equipmentId: equipmentId || ot?.equipmentId || undefined,
        serviceType: (row['TipoServicio'] as any) || ot?.serviceType || 'PROPIO',
        technicalNotes: row['Notas'] || ot?.technicalNotes || undefined,
      };

      if (ot) {
        // Update
        const oldStatus = ot.status;
        await this.workOrdersRepo.save({ ...ot, ...payload });
        updated++;

        // Registrar en historial si es diferente o si es la primera vez que se importa (aunque es update, no cambió estado, pero bueno)
        if (oldStatus !== ot.status) {
          await this.historyRepo.save({
            workOrderId: ot.id,
            previousStatus: oldStatus,
            newStatus: ot.status,
            changedById: undefined,
            notes: 'Estado actualizado vía importación de Excel',
          });
        }
      } else if (otNumber) {
        // Create (requerimos que haya OT Number para crear)
        const newOt = this.workOrdersRepo.create({
          otNumber,
          ...payload,
          status: WorkOrderStatus.RECIBIDO,
        });
        await this.workOrdersRepo.save(newOt);
        created++;
      }
    }

    return { total: data.length, created, updated };
  }
}
