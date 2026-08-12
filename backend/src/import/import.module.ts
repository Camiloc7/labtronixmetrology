import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { Client } from '../clients/entities/client.entity';
import { Quote } from '../quotes/entities/quote.entity';
import { ServiceTracking } from '../quotes/entities/service-tracking.entity';
import { EquipmentReception } from '../equipment/entities/equipment-reception.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      Quote,
      ServiceTracking,
      EquipmentReception,
      Equipment
    ]),
    AuthModule,
  ],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
