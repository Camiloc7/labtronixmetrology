import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Cotizaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  findAll() {
    return this.quotesService.findAll();
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
  update(@Param('id') id: string, @Body() dto: Partial<CreateQuoteDto>) {
    return this.quotesService.update(id, dto);
  }

  @Get(':id/pdf')
  @Roles('ADMIN', 'COMERCIAL')
  @ApiOperation({ summary: 'Generar y descargar PDF de cotización' })
  generatePdf(@Param('id') id: string, @Res() res: Response) {
    return this.quotesService.generatePdf(id, res);
  }
}
