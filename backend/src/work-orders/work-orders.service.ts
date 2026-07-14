import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrder, WorkOrderStatus } from './entities/work-order.entity';
import { StatusHistory } from './entities/status-history.entity';
import { CreateWorkOrderDto, ChangeStatusDto } from './dto/work-order.dto';

@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectRepository(WorkOrder)
    private readonly workOrdersRepo: Repository<WorkOrder>,
    @InjectRepository(StatusHistory)
    private readonly historyRepo: Repository<StatusHistory>,
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
}
