import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { WorkOrder } from './work-order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('status_history')
export class StatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: WorkOrder;

  @Column({ name: 'work_order_id' })
  workOrderId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'changed_by' })
  changedBy: User;

  @Column({ name: 'changed_by' })
  changedById: string;

  @Column({ name: 'previous_status', length: 50, nullable: true })
  previousStatus: string;

  @Column({ name: 'new_status', length: 50 })
  newStatus: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;
}
