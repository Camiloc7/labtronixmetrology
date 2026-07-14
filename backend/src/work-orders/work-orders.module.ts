import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrdersService } from './work-orders.service';
import { WorkOrdersController } from './work-orders.controller';
import { WorkOrder } from './entities/work-order.entity';
import { StatusHistory } from './entities/status-history.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder, StatusHistory]), JwtModule],
  providers: [WorkOrdersService],
  controllers: [WorkOrdersController],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
