import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  COMERCIAL = 'COMERCIAL',
  TECNICO = 'TECNICO',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 200, unique: true })
  email: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash?: string | null;

  @Column({ name: 'google_id', nullable: true, unique: true })
  googleId?: string | null;

  @Column({ name: 'hashed_refresh_token', nullable: true })
  hashedRefreshToken?: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.COMERCIAL })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
