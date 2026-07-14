import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
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

  async create(dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const exists = await this.findByEmail(dto.email);
    if (exists) throw new ConflictException('El email ya está registrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({ ...dto, passwordHash });
    const saved = await this.usersRepo.save(user);
    const { passwordHash: _, ...result } = saved;
    return result as any;
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
}
