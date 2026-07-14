import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivityLogsService } from './activity-logs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Logs de Actividad')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.activityLogsService.findAll(limit ? parseInt(limit) : 100);
  }
}
