import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
  ) {}

  async findAll(search?: string): Promise<Client[]> {
    if (search) {
      return this.clientsRepo.find({
        where: [
          { companyName: ILike(`%${search}%`) },
          { nit: ILike(`%${search}%`) },
          { contactName: ILike(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }
    return this.clientsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepo.findOne({ where: { id } });
    if (!client) throw new NotFoundException(`Cliente ${id} no encontrado`);
    return client;
  }

  async create(dto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepo.create(dto);
    return this.clientsRepo.save(client);
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    return this.clientsRepo.save({ ...client, ...dto });
  }

  async deactivate(id: string): Promise<{ message: string }> {
    const client = await this.findOne(id);
    await this.clientsRepo.save({ ...client, isActive: false });
    return { message: 'Cliente desactivado correctamente' };
  }
}
