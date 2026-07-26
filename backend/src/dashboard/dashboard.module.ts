import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Quote } from '../quotes/entities/quote.entity';
import { WorkOrder } from '../work-orders/entities/work-order.entity';
import { WorkOrderItem } from '../work-orders/entities/work-order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, WorkOrder, WorkOrderItem]), JwtModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
