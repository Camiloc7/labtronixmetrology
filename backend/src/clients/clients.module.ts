import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), JwtModule],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
