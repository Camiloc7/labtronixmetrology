import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrdersService } from './work-orders.service';
import { WorkOrdersController } from './work-orders.controller';
import { WorkOrder } from './entities/work-order.entity';
import { StatusHistory } from './entities/status-history.entity';
import { JwtModule } from '@nestjs/jwt';
import { ExcelModule } from '../common/excel/excel.module';
import { Client } from '../clients/entities/client.entity';
import { Equipment } from '../equipment/entities/equipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder, StatusHistory, Client, Equipment]), JwtModule, ExcelModule],
  providers: [WorkOrdersService],
  controllers: [WorkOrdersController],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
