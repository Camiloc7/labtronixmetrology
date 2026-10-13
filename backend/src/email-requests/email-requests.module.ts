import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailRequestsService } from './email-requests.service';
import { EmailRequestsController } from './email-requests.controller';
import { EmailRequest } from './entities/email-request.entity';
import { JwtModule } from '@nestjs/jwt';
import { ExcelModule } from '../common/excel/excel.module';
import { PublicContactController } from './public-contact.controller';
import { PublicContactRateLimitGuard } from './public-contact-rate-limit.guard';

@Module({
  imports: [TypeOrmModule.forFeature([EmailRequest]), JwtModule, ExcelModule],
  providers: [EmailRequestsService, PublicContactRateLimitGuard],
  controllers: [EmailRequestsController, PublicContactController],
})
export class EmailRequestsModule {}
