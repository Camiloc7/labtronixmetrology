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
}
