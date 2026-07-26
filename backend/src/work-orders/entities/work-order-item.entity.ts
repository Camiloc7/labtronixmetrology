import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { WorkOrder } from './work-order.entity';
import { Equipment } from '../../equipment/entities/equipment.entity';
import { User } from '../../users/entities/user.entity';

export enum WorkOrderStatus {
  RECIBIDO = 'RECIBIDO',
  EN_PROCESO = 'EN_PROCESO',
  CALIBRADO = 'CALIBRADO',
  LISTO_ENVIO = 'LISTO_ENVIO',
  DESPACHADO = 'DESPACHADO',
}

export enum ServiceType {
  PROPIO = 'PROPIO',
  TERCERIZADO = 'TERCERIZADO',
}

@Entity('work_order_items')
export class WorkOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkOrder, (wo) => wo.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: WorkOrder;

  @Column({ name: 'work_order_id' })
  workOrderId: string;

  @ManyToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @Column({ name: 'equipment_id' })
  equipmentId: string;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User;

  @Column({ name: 'assigned_to', nullable: true })
  assignedToId: string;

  @Column({
    name: 'service_type',
    type: 'enum',
    enum: ServiceType,
    default: ServiceType.PROPIO,
  })
  serviceType: ServiceType;

  @Column({
    type: 'enum',
    enum: WorkOrderStatus,
    default: WorkOrderStatus.RECIBIDO,
  })
  status: WorkOrderStatus;

  @Column({ name: 'technical_notes', type: 'text', nullable: true })
  technicalNotes: string;

  @Column({ name: 'sticker_printed', default: false })
  stickerPrinted: boolean;

  @Column({ name: 'dispatched_at', type: 'timestamp', nullable: true })
  dispatchedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
