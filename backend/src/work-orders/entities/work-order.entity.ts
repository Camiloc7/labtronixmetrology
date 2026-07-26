import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Quote } from '../../quotes/entities/quote.entity';
import { WorkOrderItem } from './work-order-item.entity';

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ot_number', length: 30, unique: true })
  otNumber: string;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => Quote, { nullable: true, eager: true })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @Column({ name: 'quote_id', nullable: true })
  quoteId: string;

  @Column({ type: 'date', nullable: true })
  requestDate: Date;

  @Column({ type: 'date', nullable: true })
  serviceDate: Date;

  @Column({ length: 150, nullable: true })
  activity: string;

  @Column({ name: 'certificate_to_name', length: 255, nullable: true })
  certificateToName: string;

  @Column({ name: 'certificate_address', type: 'text', nullable: true })
  certificateAddress: string;

  @Column({ name: 'certificate_contact', length: 150, nullable: true })
  certificateContact: string;

  @Column({ name: 'certificate_phone', length: 50, nullable: true })
  certificatePhone: string;

  @Column({ name: 'certificate_city', length: 100, nullable: true })
  certificateCity: string;

  @Column({ name: 'requester_name', length: 150, nullable: true })
  requesterName: string;

  @Column({ name: 'requester_role', length: 150, nullable: true })
  requesterRole: string;

  @Column({ name: 'authorizer_name', length: 150, nullable: true })
  authorizerName: string;

  @Column({ name: 'authorizer_role', length: 150, nullable: true })
  authorizerRole: string;

  @OneToMany(() => WorkOrderItem, (item) => item.workOrder, { cascade: true, eager: true })
  items: WorkOrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
