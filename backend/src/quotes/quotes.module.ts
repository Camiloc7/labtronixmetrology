import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { Quote } from './entities/quote.entity';
import { QuoteItem } from './entities/quote-item.entity';
import { QuoteHistory } from './entities/quote-history.entity';
import { ServiceTracking } from './entities/service-tracking.entity';
import { Client } from '../clients/entities/client.entity';
import { Requisition } from '../requisitions/entities/requisition.entity';
import { JwtModule } from '@nestjs/jwt';
import { ExcelModule } from '../common/excel/excel.module';
import { SettingsModule } from '../settings/settings.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, QuoteItem, QuoteHistory, ServiceTracking, Client, Requisition]), JwtModule, ExcelModule, SettingsModule, NotificationsModule, CloudinaryModule],
  providers: [QuotesService],
  controllers: [QuotesController],
  exports: [QuotesService],
})
export class QuotesModule {}
