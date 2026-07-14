import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';

@Entity('equipment')
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ name: 'internal_code', length: 50, unique: true })
  internalCode: string;

  @Column({ length: 100, nullable: true })
  brand: string;

  @Column({ length: 100, nullable: true })
  model: string;

  @Column({ name: 'serial_number', length: 100, nullable: true })
  serialNumber: string;

  @Column({ length: 100, nullable: true })
  capacity: string;

  @Column({ length: 150, nullable: true })
  location: string;

  @Column({ name: 'received_at', type: 'timestamp', default: () => 'NOW()' })
  receivedAt: Date;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'received_by' })
  receivedBy: User;

  @Column({ name: 'received_by', nullable: true })
  receivedById: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
