import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { WorkOrderItem } from './work-order-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity('work_order_photos')
export class WorkOrderPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkOrderItem, (item) => item.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'work_order_item_id' })
  workOrderItem: WorkOrderItem;

  @Column({ name: 'work_order_item_id' })
  workOrderItemId: string;

  @Column({ name: 'public_id' })
  publicId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'captured_by' })
  capturedBy: User;

  @Column({ name: 'captured_by', nullable: true })
  capturedById: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
