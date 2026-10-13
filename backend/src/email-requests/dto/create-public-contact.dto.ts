import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const PUBLIC_CONTACT_SERVICES = [
  'calibracion-balanzas',
  'calibracion-temperatura',
  'calibracion-presion',
  'calibracion-volumen',
  'venta-equipos',
  'otro',
] as const;

export class CreatePublicContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombre: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  empresa: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  telefono: string;

  @IsIn(PUBLIC_CONTACT_SERVICES)
  servicio: (typeof PUBLIC_CONTACT_SERVICES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  mensaje?: string;

  // Campo trampa: los navegadores lo dejan vacío; muchos bots lo completan.
  @IsOptional()
  @IsString()
  @MaxLength(0)
  website?: string;
}
