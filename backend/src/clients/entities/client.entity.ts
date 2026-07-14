import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_name', length: 200 })
  companyName: string;

  @Column({ length: 20, nullable: true, unique: true })
  nit: string;

  @Column({ name: 'contact_name', length: 150, nullable: true })
  contactName: string;

  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ length: 200, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
