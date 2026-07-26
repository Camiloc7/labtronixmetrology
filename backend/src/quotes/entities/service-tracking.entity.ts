import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Quote } from './quote.entity';

@Entity('service_tracking')
export class ServiceTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Quote, (quote) => quote.serviceTracking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quote_id' })
  quote: Quote;

  @Column({ name: 'quote_id' })
  quoteId: string;

  @Column({ name: 'fecha_pactada_servicio', type: 'date', nullable: true })
  fechaPactadaServicio: Date;

  @Column({ name: 'id_orden_trabajo', length: 50, nullable: true })
  idOrdenTrabajo: string;

  @Column({ name: 'id_requisicion', length: 50, nullable: true })
  idRequisicion: string;

  @Column({ name: 'fecha_reporte', type: 'date', nullable: true })
  fechaReporte: Date;

  @Column({ name: 'id_reporte_servicio', length: 50, nullable: true })
  idReporteServicio: string;

  @Column({ name: 'fecha_recepcion_equipos', type: 'date', nullable: true })
  fechaRecepcionEquipos: Date;

  @Column({ name: 'id_recepcion_equipos', length: 50, nullable: true })
  idRecepcionEquipos: string;

  @Column({ name: 'fecha_entrega_oc', type: 'date', nullable: true })
  fechaEntregaOc: Date;

  @Column({ name: 'id_orden_compra', length: 50, nullable: true })
  idOrdenCompra: string;

  @Column({ name: 'fecha_ingreso_lab_externo', type: 'date', nullable: true })
  fechaIngresoLabExterno: Date;

  @Column({ name: 'laboratorio_externo', length: 150, nullable: true })
  laboratorioExterno: string;

  @Column({ name: 'fecha_entrega_equipo_lab_externo', type: 'date', nullable: true })
  fechaEntregaEquipoLabExterno: Date;

  @Column({ name: 'fecha_recoger_equipo', type: 'date', nullable: true })
  fechaRecogerEquipo: Date;

  @Column({ name: 'fecha_entrega_equipo_cliente', type: 'date', nullable: true })
  fechaEntregaEquipoCliente: Date;

  @Column({ name: 'id_reporte_entrega_servicios', length: 50, nullable: true })
  idReporteEntregaServicios: string;

  @Column({ name: 'fecha_reporte_entrega_servicio', type: 'date', nullable: true })
  fechaReporteEntregaServicio: Date;

  @Column({ name: 'fecha_emision_certificado', type: 'date', nullable: true })
  fechaEmisionCertificado: Date;

  @Column({ name: 'id_certificado', length: 50, nullable: true })
  idCertificado: string;

  @Column({ name: 'fecha_entrega_certificado', type: 'date', nullable: true })
  fechaEntregaCertificado: Date;

  @Column({ name: 'id_factura', length: 50, nullable: true })
  idFactura: string;

  @Column({ name: 'fecha_factura', type: 'date', nullable: true })
  fechaFactura: Date;

  @Column({ name: 'fecha_pago', type: 'date', nullable: true })
  fechaPago: Date;

  @Column({ name: 'comprobante_egreso', length: 50, nullable: true })
  comprobanteEgreso: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
