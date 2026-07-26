import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { RequisitionItem } from './requisition-item.entity';

@Entity('requisitions')
export class Requisition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'consecutive_number', length: 30, unique: true })
  consecutiveNumber: string;

  @Column({ length: 150, default: 'Calibración de Equipos' })
  activity: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'certificate_to_name', length: 255 })
  certificateToName: string;

  @Column({ name: 'certificate_address', type: 'text' })
  certificateAddress: string;

  @Column({ name: 'quote_number', length: 50, nullable: true })
  quoteNumber: string;

  @Column({ name: 'requester_name', length: 150 })
  requesterName: string;

  @Column({ name: 'requester_role', length: 150 })
  requesterRole: string;

  @Column({ name: 'authorizer_name', length: 150, nullable: true })
  authorizerName: string;

  @Column({ name: 'authorizer_role', length: 150, nullable: true })
  authorizerRole: string;

  @OneToMany(() => RequisitionItem, (item) => item.requisition, { cascade: true, eager: true })
  items: RequisitionItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
