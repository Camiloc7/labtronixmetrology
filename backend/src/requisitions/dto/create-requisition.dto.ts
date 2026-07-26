import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRequisitionItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unitOfMeasure: string;
}

export class CreateRequisitionDto {
  @IsString()
  @IsNotEmpty()
  consecutiveNumber: string;

  @IsString()
  @IsNotEmpty()
  activity: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  certificateToName: string;

  @IsString()
  @IsNotEmpty()
  certificateAddress: string;

  @IsString()
  @IsOptional()
  quoteNumber?: string;

  @IsString()
  @IsNotEmpty()
  requesterName: string;

  @IsString()
  @IsNotEmpty()
  requesterRole: string;

  @IsString()
  @IsOptional()
  authorizerName?: string;

  @IsString()
  @IsOptional()
  authorizerRole?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequisitionItemDto)
  items: CreateRequisitionItemDto[];
}
