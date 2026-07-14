import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailRequestsService } from './email-requests.service';
import { EmailRequestsController } from './email-requests.controller';
import { EmailRequest } from './entities/email-request.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([EmailRequest]), JwtModule],
  providers: [EmailRequestsService],
  controllers: [EmailRequestsController],
})
export class EmailRequestsModule {}
