import { Type } from 'class-transformer';
import {
  IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber,
  IsOptional, IsString, IsUUID, Min, ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuoteStatus } from '../entities/quote.entity';

export class CreateQuoteItemDto {
  @ApiProperty({ example: 'Calibración de balanza analítica' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class CreateQuoteDto {
  @ApiProperty()
  @IsUUID()
  clientId: string;

  @ApiPropertyOptional({ enum: QuoteStatus })
  @IsOptional()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiProperty({ type: [CreateQuoteItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items: CreateQuoteItemDto[];
}
