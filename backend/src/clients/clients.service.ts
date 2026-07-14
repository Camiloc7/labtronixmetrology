import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ExcelService } from '../common/excel/excel.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
    private readonly excelService: ExcelService,
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

  async exportToExcel(): Promise<Buffer> {
    const clients = await this.clientsRepo.find({ order: { createdAt: 'DESC' } });
    const data = clients.map((client) => ({
      NombreEmpresa: client.companyName,
      NIT: client.nit,
      Contacto: client.contactName,
      Telefono: client.phone,
      Email: client.email,
      Direccion: client.address,
      Ciudad: client.city,
      Notas: client.notes,
      Activo: client.isActive ? 'SI' : 'NO',
      ID: client.id,
    }));
    return this.excelService.exportToExcel(data, 'Clientes');
  }

  async importFromExcel(buffer: Buffer): Promise<{ total: number; created: number; updated: number }> {
    const data = await this.excelService.importFromExcel(buffer);
    let created = 0;
    let updated = 0;

    for (const row of data) {
      const nit = row['NIT'] ? String(row['NIT']).trim() : null;
      const companyName = row['NombreEmpresa'] ? String(row['NombreEmpresa']).trim() : null;
      
      if (!companyName) continue; // El nombre es obligatorio

      let client: Client | null = null;
      if (nit) {
        client = await this.clientsRepo.findOne({ where: { nit } });
      } else if (companyName) {
        client = await this.clientsRepo.findOne({ where: { companyName } });
      }

      const payload = {
        companyName,
        nit: nit || undefined,
        contactName: row['Contacto'] || undefined,
        phone: row['Telefono'] ? String(row['Telefono']) : undefined,
        email: row['Email'] || undefined,
        address: row['Direccion'] || undefined,
        city: row['Ciudad'] || undefined,
        notes: row['Notas'] || undefined,
        isActive: row['Estado'] === 'Inactivo' ? false : true,
      };

      if (client) {
        await this.clientsRepo.save({ ...client, ...payload });
        updated++;
      } else {
        const newClient = this.clientsRepo.create(payload);
        await this.clientsRepo.save(newClient);
        created++;
      }
    }

    return { total: data.length, created, updated };
  }
}
