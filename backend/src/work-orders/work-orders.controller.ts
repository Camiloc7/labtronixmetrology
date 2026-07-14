import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto, ChangeStatusDto } from './dto/work-order.dto';
import { WorkOrderStatus } from './entities/work-order.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Órdenes de Trabajo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Get()
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  findAll(@Query('status') status?: WorkOrderStatus) {
    return this.workOrdersService.findAll(status);
  }

  @Get('stats')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  getStats() {
    return this.workOrdersService.getStats();
  }

  @Get(':id')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  findOne(@Param('id') id: string) {
    return this.workOrdersService.findOne(id);
  }

  @Get(':id/history')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  getHistory(@Param('id') id: string) {
    return this.workOrdersService.getHistory(id);
  }

  @Get(':id/sticker')
  @Roles('ADMIN', 'TECNICO')
  getStickerData(@Param('id') id: string) {
    return this.workOrdersService.getStickerData(id);
  }

  @Post()
  @Roles('ADMIN', 'TECNICO')
  create(@Body() dto: CreateWorkOrderDto) {
    return this.workOrdersService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'TECNICO')
  update(@Param('id') id: string, @Body() dto: Partial<CreateWorkOrderDto>) {
    return this.workOrdersService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'TECNICO')
  changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeStatusDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workOrdersService.changeStatus(id, dto, userId);
  }
}
