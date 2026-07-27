import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Res, UseInterceptors, UploadedFile, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateServiceTrackingDto } from './dto/update-service-tracking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Cotizaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get('export')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  @ApiOperation({ summary: 'Exportar cotizaciones a Excel' })
  async exportExcel(@Res() res: Response) {
    const buffer = await this.quotesService.exportToExcel();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="cotizaciones.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')
  @Roles('ADMIN', 'COMERCIAL')
  @ApiOperation({ summary: 'Importar cotizaciones desde Excel' })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File, @CurrentUser('sub') userId: string) {
    if (!file) throw new BadRequestException('Archivo no proporcionado');
    return this.quotesService.importFromExcel(file.buffer, userId);
  }

  @Get()
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.quotesService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  findOne(@Param('id') id: string) {
    return this.quotesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'COMERCIAL')
  create(@Body() dto: CreateQuoteDto, @CurrentUser('sub') userId: string) {
    return this.quotesService.create(dto, userId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COMERCIAL')
  update(@Param('id') id: string, @Body() dto: Partial<CreateQuoteDto>, @CurrentUser('sub') userId: string) {
    return this.quotesService.update(id, dto, userId);
  }

  @Get(':id/history')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  @ApiOperation({ summary: 'Obtener historial de cambios de la cotización' })
  getHistory(@Param('id') id: string) {
    return this.quotesService.getHistory(id);
  }

  @Get(':id/tracking')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  @ApiOperation({ summary: 'Obtener trazabilidad de la cotización' })
  getTracking(@Param('id') id: string) {
    return this.quotesService.getTracking(id);
  }

  @Patch(':id/tracking')
  @Roles('ADMIN', 'COMERCIAL')
  @ApiOperation({ summary: 'Actualizar trazabilidad de la cotización' })
  updateTracking(@Param('id') id: string, @Body() dto: UpdateServiceTrackingDto) {
    return this.quotesService.updateTracking(id, dto);
  }

  @Get(':id/pdf')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  @ApiOperation({ summary: 'Generar PDF' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    await this.quotesService.generatePdf(id, res);
  }

  @Get(':id/technical-pdf')
  @ApiOperation({ summary: 'Generar PDF técnico de la cotización' })
  @ApiResponse({ status: 200, description: 'PDF técnico generado correctamente.' })
  async downloadTechnicalPdf(@Param('id') id: string, @Res() res: Response) {
    await this.quotesService.generateTechnicalPdf(id, res);
  }

  @Get(':id/technical-excel')
  @ApiOperation({ summary: 'Generar Excel técnico de la cotización' })
  @ApiResponse({ status: 200, description: 'Excel técnico generado correctamente.' })
  async downloadTechnicalExcel(@Param('id') id: string, @Res() res: Response) {
    await this.quotesService.generateTechnicalExcel(id, res);
  }
}
