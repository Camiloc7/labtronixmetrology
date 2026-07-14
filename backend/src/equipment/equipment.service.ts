import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { PartialType } from '@nestjs/swagger';
import { CreateEquipmentDto as UpdateEquipmentDto } from './dto/create-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepo: Repository<Equipment>,
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
}
