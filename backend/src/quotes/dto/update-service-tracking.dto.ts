import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceTrackingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaPactadaServicio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  idOrdenTrabajo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  idRequisicion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaReporte?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  idReporteServicio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaRecepcionEquipos?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  idRecepcionEquipos?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaEntregaOc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  idOrdenCompra?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaIngresoLabExterno?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  laboratorioExterno?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaEntregaEquipoLabExterno?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaRecogerEquipo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaEntregaEquipoCliente?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  idReporteEntregaServicios?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaReporteEntregaServicio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaEmisionCertificado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  idCertificado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaEntregaCertificado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  idFactura?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaFactura?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechaPago?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  comprobanteEgreso?: string;
}
