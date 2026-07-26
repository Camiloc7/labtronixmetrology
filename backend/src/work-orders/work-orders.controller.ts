import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, Res, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto, ChangeStatusDto } from './dto/work-order.dto';
import { WorkOrderStatus } from './entities/work-order-item.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Órdenes de Trabajo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Get(':id/pdf')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  @ApiOperation({ summary: 'Generar PDF de OT' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.workOrdersService.generatePdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ot-${id}.pdf"`,
    });
    res.send(buffer);
  }

  @Get(':id/excel')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  @ApiOperation({ summary: 'Generar Excel de OT' })
  async generateExcel(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.workOrdersService.generateExcel(id);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="ot-${id}.xlsx"`,
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
  findAll() {
    return this.workOrdersService.findAll();
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

  @Get('items/:itemId/history')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  getItemHistory(@Param('itemId') itemId: string) {
    return this.workOrdersService.getItemHistory(itemId);
  }

  @Get('items/:itemId/sticker')
  @Roles('ADMIN', 'TECNICO')
  getStickerData(@Param('itemId') itemId: string) {
    return this.workOrdersService.getStickerData(itemId);
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

  @Patch('items/:itemId/status')
  @Roles('ADMIN', 'TECNICO')
  changeItemStatus(
    @Param('itemId') itemId: string,
    @Body() dto: ChangeStatusDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workOrdersService.changeItemStatus(itemId, dto, userId);
  }
}
