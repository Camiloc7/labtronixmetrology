import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';
import { QuoteItem } from './quote-item.entity';

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

  @Column({ name: 'quote_number', length: 30, unique: true })
  quoteNumber: string;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by' })
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
