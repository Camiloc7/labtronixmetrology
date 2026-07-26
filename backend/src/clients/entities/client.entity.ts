import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cod_cliente', length: 50, nullable: true, unique: true })
  codCliente: string;

  @Index()
  @Column({ name: 'company_name', length: 200 })
  companyName: string;

  @Column({ length: 50, nullable: true, unique: true })
  nit: string;

  // General Contact (Keep for legacy or general purposes)
  @Column({ name: 'contact_name', length: 150, nullable: true })
  contactName: string;

  @Column({ length: 100, nullable: true })
  phone: string;

  @Column({ length: 200, nullable: true })
  email: string;

  // Technical Contact
  @Column({ name: 'contacto_tecnico', length: 150, nullable: true })
  contactoTecnico: string;

  @Column({ name: 'telefono_tecnico', length: 100, nullable: true })
  telefonoTecnico: string;

  @Column({ name: 'email_tecnico', length: 200, nullable: true })
  emailTecnico: string;

  // Commercial Contact
  @Column({ name: 'contacto_comercial', length: 150, nullable: true })
  contactoComercial: string;

  @Column({ name: 'telefono_comercial', length: 100, nullable: true })
  telefonoComercial: string;

  @Column({ name: 'email_comercial', length: 200, nullable: true })
  emailComercial: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 150, nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
