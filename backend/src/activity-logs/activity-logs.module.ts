import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLog } from './entities/activity-log.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog]), JwtModule],
  providers: [ActivityLogsService],
  controllers: [ActivityLogsController],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
