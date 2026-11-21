import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';
import { Client, ClientContact } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';
import { QuoteItem } from './quote-item.entity';
import { ServiceTracking } from './service-tracking.entity';
import type { Requisition } from '../../requisitions/entities/requisition.entity';

export enum QuoteStatus {
  BORRADOR = 'BORRADOR',
  ENVIADA = 'ENVIADA',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
}

export enum QuoteRequestChannel {
  WHATSAPP = 'WHATSAPP',
  TELEFONICO = 'TELEFONICO',
  CORREO = 'CORREO',
  PRESENCIAL = 'PRESENCIAL',
  SOPORTE_CARGADO = 'SOPORTE_CARGADO',
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

  @Column({ name: 'request_channel', type: 'varchar', length: 50, nullable: true })
  requestChannel: QuoteRequestChannel | null;

  @Column({ name: 'support_file_public_id', type: 'varchar', length: 255, nullable: true })
  supportFilePublicId: string | null;

  @Column({ name: 'support_file_name', type: 'varchar', length: 255, nullable: true })
  supportFileName: string | null;

  @Column({ name: 'support_file_mime', type: 'varchar', length: 100, nullable: true })
  supportFileMime: string | null;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  contacts: ClientContact[];

  @Column({ name: 'payment_terms', type: 'text', nullable: true })
  paymentTerms: string | null;

  @Column({ name: 'delivery_time', type: 'text', nullable: true })
  deliveryTime: string | null;

  @Column({ name: 'delivery_place', type: 'text', nullable: true })
  deliveryPlace: string | null;

  @Column({ type: 'text', nullable: true })
  warranty: string | null;

  @Column({ name: 'offer_validity', type: 'text', nullable: true })
  offerValidity: string | null;

  @ManyToOne('Requisition', { nullable: true })
  @JoinColumn({ name: 'requisition_id' })
  requisition: any;

  @Column({ name: 'requisition_id', type: 'uuid', nullable: true })
  requisitionId: string | null;

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
