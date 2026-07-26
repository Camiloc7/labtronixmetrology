import { IsEnum, IsOptional, IsString, IsUUID, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType, WorkOrderStatus } from '../entities/work-order-item.entity';

export class CreateWorkOrderItemDto {
  @ApiProperty()
  @IsUUID()
  equipmentId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @ApiPropertyOptional({ enum: ServiceType })
  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  technicalNotes?: string;
}

export class CreateWorkOrderDto {
  @ApiProperty()
  @IsString()
  otNumber: string;

  @ApiProperty()
  @IsUUID()
  clientId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  quoteId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  requestDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  serviceDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  activity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificateToName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificateAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificateContact?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificatePhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificateCity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requesterName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requesterRole?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authorizerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authorizerRole?: string;

  @ApiProperty({ type: [CreateWorkOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkOrderItemDto)
  items: CreateWorkOrderItemDto[];
}

export class ChangeStatusDto {
  @ApiProperty({ enum: WorkOrderStatus })
  @IsEnum(WorkOrderStatus)
  status: WorkOrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
