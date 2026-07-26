import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { Quote } from './quote.entity';

@Entity('quote_items')
export class QuoteItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quote, (quote) => quote.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @Column({ name: 'quote_id' })
  quoteId: string;

  @Column({ length: 300 })
  description: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ name: 'service_type', length: 100, nullable: true })
  serviceType: string;

  @Column({ name: 'equipment_name', length: 200, nullable: true })
  equipmentName: string;

  @Column({ name: 'measuring_range', length: 200, nullable: true })
  measuringRange: string;

  @Column({ name: 'scale_division', length: 200, nullable: true })
  scaleDivision: string;

  @Column({ length: 100, nullable: true })
  brand: string;

  @Column({ length: 100, nullable: true })
  model: string;

  @Column({ name: 'serial_number', length: 100, nullable: true })
  serialNumber: string;

  @Column({ name: 'internal_code', length: 100, nullable: true })
  internalCode: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ name: 'calibration_points', type: 'text', nullable: true })
  calibrationPoints: string;
}
