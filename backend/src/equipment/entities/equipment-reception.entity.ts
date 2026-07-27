import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Quote } from '../../quotes/entities/quote.entity';
import { Client } from '../../clients/entities/client.entity';

@Entity('equipment_receptions')
export class EquipmentReception {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Quote, { eager: true, nullable: true })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @Column({ name: 'quote_id', nullable: true })
  quoteId: string;

  @ManyToOne(() => Client, { eager: true, nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id', nullable: true })
  clientId: string;

  @Column({ name: 'n_recepcion', type: 'text', nullable: true })
  nRecepcion: string;

  @Column({ name: 'fecha_recepcion', type: 'date', nullable: true })
  fechaRecepcion: Date;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @Column({ type: 'text', nullable: true })
  magnitud: string;

  @Column({ type: 'text', nullable: true })
  acreditacion: string;

  @Column({ name: 'lugar_calibracion', type: 'text', nullable: true })
  lugarCalibracion: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'fecha_devolucion', type: 'date', nullable: true })
  fechaDevolucion: Date;

  @Column({ name: 'consecutivo_entrega', type: 'text', nullable: true })
  consecutivoEntrega: string;

  @Column({ name: 'entregado_por', type: 'text', nullable: true })
  entregadoPor: string;

  @Column({ name: 'fecha_calibracion', type: 'date', nullable: true })
  fechaCalibracion: Date;

  @Column({ name: 'fecha_envio_certificado', type: 'date', nullable: true })
  fechaEnvioCertificado: Date;

  @Column({ name: 'no_certificado', type: 'text', nullable: true })
  noCertificado: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
