import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
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
