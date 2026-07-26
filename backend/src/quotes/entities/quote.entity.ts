import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';
import { QuoteItem } from './quote-item.entity';
import { ServiceTracking } from './service-tracking.entity';

export enum QuoteStatus {
  BORRADOR = 'BORRADOR',
  ENVIADA = 'ENVIADA',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
}

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quote_number', length: 100, unique: true })
  quoteNumber: string;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by', nullable: true })
  createdById: string;

  @Column({ type: 'enum', enum: QuoteStatus, default: QuoteStatus.BORRADOR })
  status: QuoteStatus;

  @Column({ name: 'total_value', type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalValue: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'pdf_url', nullable: true })
  pdfUrl: string;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil: Date;

  @OneToMany(() => QuoteItem, (item) => item.quote, { cascade: true, eager: true })
  items: QuoteItem[];

  @OneToOne(() => ServiceTracking, (tracking) => tracking.quote, { cascade: true, eager: true })
  serviceTracking: ServiceTracking;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
