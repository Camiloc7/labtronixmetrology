import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index
} from 'typeorm';
import { Quote } from './quote.entity';
import { User } from '../../users/entities/user.entity';

export enum QuoteHistoryAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
}

@Entity('quote_history')
export class QuoteHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => Quote, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @Column({ name: 'quote_id' })
  quoteId: string;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ type: 'enum', enum: QuoteHistoryAction })
  action: QuoteHistoryAction;

  @Column({ type: 'jsonb', nullable: true })
  changes: any;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
