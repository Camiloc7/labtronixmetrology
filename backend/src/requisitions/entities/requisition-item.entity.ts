import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { Requisition } from './requisition.entity';

@Entity('requisition_items')
export class RequisitionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Requisition, (requisition) => requisition.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requisition_id' })
  requisition: Requisition;

  @Column({ name: 'requisition_id' })
  requisitionId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'unit_of_measure', length: 50, default: 'Und' })
  unitOfMeasure: string;

  @Column({ type: 'text' })
  description: string;
}
