import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsCron } from './notifications.cron';
import { Notification } from './entities/notification.entity';
import { Quote } from '../quotes/entities/quote.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Quote]),
    JwtModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsCron],
  exports: [NotificationsService],
})
export class NotificationsModule {}
