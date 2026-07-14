import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { PartialType } from '@nestjs/swagger';
import { CreateEquipmentDto as UpdateEquipmentDto } from './dto/create-equipment.dto';
import { ExcelService } from '../common/excel/excel.service';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepo: Repository<Equipment>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    private readonly excelService: ExcelService,
  ) {}

  private async generateCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.equipmentRepo.count();
    return `EQ-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async findAll(search?: string): Promise<Equipment[]> {
    if (search) {
      return this.equipmentRepo.find({
        where: [
          { brand: ILike(`%${search}%`) },
          { model: ILike(`%${search}%`) },
          { internalCode: ILike(`%${search}%`) },
          { serialNumber: ILike(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }
    return this.equipmentRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Equipment> {
    const eq = await this.equipmentRepo.findOne({ where: { id } });
    if (!eq) throw new NotFoundException(`Equipo ${id} no encontrado`);
    return eq;
  }

  async create(dto: CreateEquipmentDto, userId: string): Promise<Equipment> {
    const internalCode = await this.generateCode();
    const eq = this.equipmentRepo.create({
      ...dto,
      internalCode,
      receivedById: userId,
    });
    return this.equipmentRepo.save(eq);
  }

  async update(id: string, dto: Partial<CreateEquipmentDto>): Promise<Equipment> {
    const eq = await this.findOne(id);
    return this.equipmentRepo.save({ ...eq, ...dto });
  }

  async exportToExcel(): Promise<Buffer> {
    const equipment = await this.equipmentRepo.find({ relations: { client: true }, order: { createdAt: 'DESC' } });
    const data = equipment.map(eq => ({
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

  async importFromExcel(buffer: Buffer, userId: string): Promise<{ total: number; created: number; updated: number }> {
    const data = await this.excelService.importFromExcel(buffer);
    let created = 0;
    let updated = 0;

    for (const row of data) {
      const internalCode = row['CodigoInterno'] ? String(row['CodigoInterno']).trim() : null;
      const nitCliente = row['NITCliente'] ? String(row['NITCliente']).trim() : null;
      
      let clientId: string | null = null;
      if (nitCliente) {
        const client = await this.clientRepo.findOne({ where: { nit: nitCliente } });
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
        serialNumber: row['NumeroSerie'] ? String(row['NumeroSerie']) : undefined,
        capacity: row['Capacidad'] || undefined,
        location: row['Ubicacion'] || undefined,
        notes: row['Notas'] || undefined,
      };

      if (eq) {
        await this.equipmentRepo.save({ ...eq, ...payload });
        updated++;
      } else {
        const newCode = internalCode || await this.generateCode();
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
}
