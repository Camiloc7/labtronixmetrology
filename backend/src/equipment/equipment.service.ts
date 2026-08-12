import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { EquipmentReception } from './entities/equipment-reception.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { PartialType } from '@nestjs/swagger';
import { CreateEquipmentDto as UpdateEquipmentDto } from './dto/create-equipment.dto';
import { ExcelService } from '../common/excel/excel.service';
import { Client } from '../clients/entities/client.entity';
import { Quote } from '../quotes/entities/quote.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class EquipmentService implements OnModuleInit {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepo: Repository<Equipment>,
    @InjectRepository(EquipmentReception)
    private readonly receptionRepo: Repository<EquipmentReception>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(Quote)
    private readonly quoteRepo: Repository<Quote>,
    private readonly excelService: ExcelService,
  ) {}

  async onModuleInit() {
    await this.equipmentRepo.query(
      `CREATE SEQUENCE IF NOT EXISTS equipment_code_seq START 1`,
    );

    // Sincronizar la secuencia con el valor más alto existente
    const [lastEq] = await this.equipmentRepo.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    if (lastEq && lastEq.internalCode) {
      const parts = lastEq.internalCode.split('-');
      if (parts.length === 3) {
        const lastNum = parseInt(parts[2], 10);
        if (!isNaN(lastNum)) {
          // setval(sequence, value, is_called)
          await this.equipmentRepo.query(
            `SELECT setval('equipment_code_seq', $1, true)`,
            [lastNum],
          );
        }
      }
    }
  }

  private async generateCode(): Promise<string> {
    const year = new Date().getFullYear();
    const result = await this.equipmentRepo.query(
      `SELECT nextval('equipment_code_seq')`,
    );
    const nextNumber = result[0].nextval;
    return `EQ-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Equipment>> {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { brand: ILike(`%${search}%`) },
          { model: ILike(`%${search}%`) },
          { internalCode: ILike(`%${search}%`) },
          { serialNumber: ILike(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.equipmentRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async findOne(id: string): Promise<Equipment> {
    const eq = await this.equipmentRepo.findOne({ where: { id } });
    if (!eq) throw new NotFoundException(`Equipo ${id} no encontrado`);
    return eq;
  }

  async create(dto: CreateEquipmentDto, userId: string): Promise<Equipment> {
    let retries = 3;
    while (retries > 0) {
      try {
        const internalCode = await this.generateCode();
        const eq = this.equipmentRepo.create({
          ...dto,
          internalCode,
          receivedById: userId,
        });
        return await this.equipmentRepo.save(eq);
      } catch (error: any) {
        if (error.code === '23505' && retries > 1) {
          retries--;
          // Jitter backoff (10ms to 100ms) to avoid thundering herd collisions
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 90 + 10),
          );
          continue;
        }
        throw error;
      }
    }
    throw new Error('Could not generate unique internalCode');
  }

  async update(
    id: string,
    dto: Partial<CreateEquipmentDto>,
  ): Promise<Equipment> {
    const eq = await this.findOne(id);
    return this.equipmentRepo.save({ ...eq, ...dto });
  }

  async exportToExcel(): Promise<Buffer> {
    const equipment = await this.equipmentRepo.find({
      relations: { client: true },
      order: { createdAt: 'DESC' },
    });
    const data = equipment.map((eq) => ({
      CodigoInterno: eq.internalCode,
      NITCliente: eq.client?.nit || '',
      NombreCliente: eq.client?.companyName || '',
      Marca: eq.brand,
      Modelo: eq.model,
      NumeroSerie: eq.serialNumber,
      Capacidad: eq.capacity,
      Ubicacion: eq.location,
      Notas: eq.notes,
      FechaRecepcion: eq.receivedAt,
    }));
    return this.excelService.exportToExcel(data, 'Equipos');
  }

  async importFromExcel(
    buffer: Buffer,
    userId: string,
  ): Promise<{ total: number; created: number; updated: number }> {
    const data = await this.excelService.importFromExcel(buffer);
    let created = 0;
    let updated = 0;

    for (const row of data) {
      const internalCode = row['CodigoInterno']
        ? String(row['CodigoInterno']).trim()
        : null;
      const nitCliente = row['NITCliente']
        ? String(row['NITCliente']).trim()
        : null;

      let clientId: string | null = null;
      if (nitCliente) {
        const client = await this.clientRepo.findOne({
          where: { nit: nitCliente },
        });
        if (client) clientId = client.id;
      }

      let eq: Equipment | null = null;
      if (internalCode) {
        eq = await this.equipmentRepo.findOne({ where: { internalCode } });
      }

      const payload = {
        clientId: clientId || eq?.clientId || undefined,
        brand: row['Marca'] || undefined,
        model: row['Modelo'] || undefined,
        serialNumber: row['NumeroSerie']
          ? String(row['NumeroSerie'])
          : undefined,
        capacity: row['Capacidad'] || undefined,
        location: row['Ubicacion'] || undefined,
        notes: row['Notas'] || undefined,
      };

      if (eq) {
        await this.equipmentRepo.save({ ...eq, ...payload });
        updated++;
      } else {
        const newCode = internalCode || (await this.generateCode());
        const newEq = this.equipmentRepo.create({
          ...payload,
          internalCode: newCode,
          receivedById: userId,
        });
        await this.equipmentRepo.save(newEq);
        created++;
      }
    }

    return { total: data.length, created, updated };
  }

  async getReceptionsByQuoteId(quoteId: string): Promise<EquipmentReception[]> {
    return this.receptionRepo.find({
      where: { quoteId },
      order: { createdAt: 'ASC' },
    });
  }

  async syncFromQuote(
    quoteId: string,
    userId: string,
  ): Promise<{ created: number }> {
    const quote = await this.quoteRepo.findOne({
      where: { id: quoteId },
      relations: { items: true },
    });

    if (!quote) {
      throw new NotFoundException(`Cotización ${quoteId} no encontrada`);
    }

    let created = 0;

    for (const item of quote.items) {
      // Intentar buscar si el equipo ya existe por internalCode o serialNumber (para este cliente)
      let existingEq: Equipment | null = null;

      if (item.internalCode) {
        existingEq = await this.equipmentRepo.findOne({
          where: { internalCode: item.internalCode },
        });
      }

      if (!existingEq && item.serialNumber) {
        existingEq = await this.equipmentRepo.findOne({
          where: { serialNumber: item.serialNumber, clientId: quote.clientId },
        });
      }

      // Si no existe, crearlo
      if (!existingEq) {
        const internalCode = item.internalCode || (await this.generateCode());

        const newEq = this.equipmentRepo.create({
          clientId: quote.clientId,
          internalCode,
          name: item.equipmentName || item.description || 'Equipo Importado',
          brand: item.brand,
          model: item.model,
          serialNumber: item.serialNumber,
          capacity: item.measuringRange || item.scaleDivision,
          location: item.location,
          notes: item.calibrationPoints
            ? `Puntos de calibración: ${item.calibrationPoints}`
            : undefined,
          receivedById: userId,
        });

        await this.equipmentRepo.save(newEq);
        created++;
      }
    }

    return { created };
  }
}
