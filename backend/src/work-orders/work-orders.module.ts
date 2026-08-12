import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrdersService } from './work-orders.service';
import { WorkOrdersController } from './work-orders.controller';
import { WorkOrder } from './entities/work-order.entity';
import { WorkOrderItem } from './entities/work-order-item.entity';
import { StatusHistory } from './entities/status-history.entity';
import { WorkOrderPhoto } from './entities/work-order-photo.entity';
import { ExcelModule } from '../common/excel/excel.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Client } from '../clients/entities/client.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { WorkOrdersGateway } from './work-orders.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder, WorkOrderItem, StatusHistory, WorkOrderPhoto, Client, Equipment]), AuthModule, ExcelModule, CloudinaryModule],
  providers: [WorkOrdersService, WorkOrdersGateway],
  controllers: [WorkOrdersController],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
