import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailRequestsService } from './email-requests.service';
import { EmailRequestsController } from './email-requests.controller';
import { EmailRequest } from './entities/email-request.entity';
import { JwtModule } from '@nestjs/jwt';
import { ExcelModule } from '../common/excel/excel.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmailRequest]), JwtModule, ExcelModule],
  providers: [EmailRequestsService],
  controllers: [EmailRequestsController],
})
export class EmailRequestsModule {}
