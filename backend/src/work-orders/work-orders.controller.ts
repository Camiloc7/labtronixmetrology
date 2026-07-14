import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, Res, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
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

  @Get('export')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  @ApiOperation({ summary: 'Exportar OTs a Excel' })
  async exportExcel(@Res() res: Response) {
    const buffer = await this.workOrdersService.exportToExcel();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="ordenes-trabajo.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')
  @Roles('ADMIN', 'TECNICO')
  @ApiOperation({ summary: 'Importar OTs desde Excel' })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File, @CurrentUser('sub') userId: string) {
    if (!file) throw new BadRequestException('Archivo no proporcionado');
    return this.workOrdersService.importFromExcel(file.buffer, userId);
  }

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
