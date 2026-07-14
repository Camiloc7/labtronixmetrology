import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { Quote } from './entities/quote.entity';
import { QuoteItem } from './entities/quote-item.entity';
import { Client } from '../clients/entities/client.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, QuoteItem, Client]), JwtModule],
  providers: [QuotesService],
  controllers: [QuotesController],
  exports: [QuotesService],
})
export class QuotesModule {}
