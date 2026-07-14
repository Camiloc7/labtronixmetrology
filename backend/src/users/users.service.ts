import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExcelService } from '../common/excel/excel.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly excelService: ExcelService,
  ) {}

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.usersRepo.find({ order: { createdAt: 'DESC' } });
    return users.map(({ passwordHash: _, ...rest }) => rest as any);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { googleId } });
  }

  async updateRefreshToken(id: string, hashedToken: string | null): Promise<void> {
    await this.usersRepo.update(id, { hashedRefreshToken: hashedToken } as any);
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const exists = await this.findByEmail(dto.email);
    if (exists) throw new ConflictException('El email ya está registrado');

    let passwordHash: string | undefined = undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }
    const user = this.usersRepo.create({ ...dto, passwordHash });
    const saved = await this.usersRepo.save(user);
    const { passwordHash: _, ...result } = saved;
    return result as any;
  }

  async createGoogleUser(email: string, name: string, googleId: string): Promise<User> {
    const user = this.usersRepo.create({
      email,
      name,
      googleId,
      role: UserRole.COMERCIAL,
      isActive: true,
    });
    return this.usersRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.findOne(id);
    if (dto.password) {
      (dto as any).passwordHash = await bcrypt.hash(dto.password, 10);
      delete dto.password;
    }
    const updated = await this.usersRepo.save({ ...user, ...dto });
    const { passwordHash: _, ...result } = updated;
    return result as any;
  }

  async deactivate(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.usersRepo.save({ ...user, isActive: false });
    return { message: 'Usuario desactivado correctamente' };
  }

  async exportToExcel(): Promise<Buffer> {
    const users = await this.usersRepo.find({ order: { createdAt: 'DESC' } });
    const data = users.map(user => ({
      Nombre: user.name,
      Email: user.email,
      Rol: user.role,
      Activo: user.isActive ? 'SI' : 'NO',
      FechaCreacion: user.createdAt,
    }));
    return this.excelService.exportToExcel(data, 'Usuarios');
  }

  async importFromExcel(buffer: Buffer): Promise<{ total: number; created: number; updated: number }> {
    const data = await this.excelService.importFromExcel(buffer);
    let created = 0;
    let updated = 0;

    for (const row of data) {
      const email = row['Email'] ? String(row['Email']).trim() : null;
      if (!email) continue;

      const user = await this.findByEmail(email);
      const role = row['Rol'] as UserRole || UserRole.COMERCIAL;

      const payload = {
        name: row['Nombre'] || user?.name || 'Sin Nombre',
        role,
        isActive: row['Activo'] !== 'NO',
      };

      if (user) {
        await this.usersRepo.save({ ...user, ...payload });
        updated++;
      } else {
        const passwordHash = await bcrypt.hash('Labtronix2026!', 10);
        const newUser = this.usersRepo.create({
          email,
          passwordHash,
          ...payload,
        });
        await this.usersRepo.save(newUser);
        created++;
      }
    }

    return { total: data.length, created, updated };
  }
}
