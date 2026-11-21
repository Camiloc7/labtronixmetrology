import {
  IsArray, IsBoolean, IsEmail, IsIn, IsOptional, IsString, MaxLength, ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ClientContactDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ enum: ['GENERAL', 'TECNICO', 'COMPRAS', 'OTRO'] })
  @IsIn(['GENERAL', 'TECNICO', 'COMPRAS', 'OTRO'])
  type: 'GENERAL' | 'TECNICO' | 'COMPRAS' | 'OTRO';

  @ApiProperty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  position?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreateClientDto {
  @ApiPropertyOptional({ example: 'CLI-001' })
  @IsOptional()
  @IsString()
  codCliente?: string;

  @ApiProperty({ example: 'Industrias ABC S.A.S' })
  @IsString()
  companyName: string;

  @ApiPropertyOptional({ example: '900123456-7' })
  @IsOptional()
  @IsString()
  nit?: string;

  @ApiPropertyOptional({ example: 'Carlos García' })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiPropertyOptional({ example: '3001234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'contacto@empresa.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Juan Técnico' })
  @IsOptional()
  @IsString()
  contactoTecnico?: string;

  @ApiPropertyOptional({ example: '3001112222' })
  @IsOptional()
  @IsString()
  telefonoTecnico?: string;

  @ApiPropertyOptional({ example: 'tecnico@empresa.com' })
  @IsOptional()
  @IsEmail()
  emailTecnico?: string;

  @ApiPropertyOptional({ example: 'Maria Comercial' })
  @IsOptional()
  @IsString()
  contactoComercial?: string;

  @ApiPropertyOptional({ example: '3003334444' })
  @IsOptional()
  @IsString()
  telefonoComercial?: string;

  @ApiPropertyOptional({ example: 'comercial@empresa.com' })
  @IsOptional()
  @IsEmail()
  emailComercial?: string;

  @ApiPropertyOptional({ type: [ClientContactDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientContactDto)
  contacts?: ClientContactDto[];

  @ApiPropertyOptional({ example: 'Cra 10 # 20-30' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Bogotá' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
