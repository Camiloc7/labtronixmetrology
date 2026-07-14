import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType, WorkOrderStatus } from '../entities/work-order.entity';

export class CreateWorkOrderDto {
  @ApiProperty()
  @IsUUID()
  equipmentId: string;

  @ApiProperty()
  @IsUUID()
  clientId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  quoteId?: string;

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

export class ChangeStatusDto {
  @ApiProperty({ enum: WorkOrderStatus })
  @IsEnum(WorkOrderStatus)
  status: WorkOrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
