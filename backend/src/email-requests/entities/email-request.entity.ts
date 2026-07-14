import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';

export enum EmailRequestStatus {
  PENDIENTE = 'PENDIENTE',
  PROCESADO = 'PROCESADO',
  DESCARTADO = 'DESCARTADO',
}

@Entity('email_requests')
export class EmailRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'raw_content', type: 'text' })
  rawContent: string;

  @Column({ name: 'extracted_data', type: 'jsonb', nullable: true })
  extractedData: Record<string, any>;

  @ManyToOne(() => Client, { nullable: true, eager: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id', nullable: true })
  clientId: string;

  @Column({ type: 'enum', enum: EmailRequestStatus, default: EmailRequestStatus.PENDIENTE })
  status: EmailRequestStatus;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'processed_by' })
  processedBy: User;

  @Column({ name: 'processed_by', nullable: true })
  processedById: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
