import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { Equipment } from './entities/equipment.entity';
import { EquipmentReception } from './entities/equipment-reception.entity';
import { JwtModule } from '@nestjs/jwt';
import { ExcelModule } from '../common/excel/excel.module';
import { Client } from '../clients/entities/client.entity';
import { Quote } from '../quotes/entities/quote.entity';
import { QuoteItem } from '../quotes/entities/quote-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment, EquipmentReception, Client, Quote, QuoteItem]), JwtModule, ExcelModule],
  providers: [EquipmentService],
  controllers: [EquipmentController],
  exports: [EquipmentService],
})
export class EquipmentModule {}
