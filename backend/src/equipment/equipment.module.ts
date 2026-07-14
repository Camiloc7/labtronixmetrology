import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { Equipment } from './entities/equipment.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment]), JwtModule],
  providers: [EquipmentService],
  controllers: [EquipmentController],
  exports: [EquipmentService],
})
export class EquipmentModule {}
