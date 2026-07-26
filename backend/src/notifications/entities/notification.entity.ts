import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum NotificationType {
  QUOTE_EXPIRING = 'QUOTE_EXPIRING',
  QUOTE_APPROVED = 'QUOTE_APPROVED',
  QUOTE_REJECTED = 'QUOTE_REJECTED',
  OT_DELAYED = 'OT_DELAYED',
  SYSTEM = 'SYSTEM',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string; // ID of Quote or OT

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
