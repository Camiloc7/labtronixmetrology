import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { Quote } from './entities/quote.entity';
import { QuoteItem } from './entities/quote-item.entity';
import { ServiceTracking } from './entities/service-tracking.entity';
import { Client } from '../clients/entities/client.entity';
import { JwtModule } from '@nestjs/jwt';
import { ExcelModule } from '../common/excel/excel.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, QuoteItem, ServiceTracking, Client]), JwtModule, ExcelModule, SettingsModule],
  providers: [QuotesService],
  controllers: [QuotesController],
  exports: [QuotesService],
})
export class QuotesModule {}
