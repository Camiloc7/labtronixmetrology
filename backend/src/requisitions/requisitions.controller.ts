import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { RequisitionsService } from './requisitions.service';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { UpdateRequisitionDto } from './dto/update-requisition.dto';

@Controller('requisitions')
export class RequisitionsController {
  constructor(private readonly requisitionsService: RequisitionsService) {}

  @Post()
  create(@Body() createRequisitionDto: CreateRequisitionDto) {
    return this.requisitionsService.create(createRequisitionDto);
  }

  @Get()
  findAll() {
    return this.requisitionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requisitionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequisitionDto: UpdateRequisitionDto) {
    return this.requisitionsService.update(id, updateRequisitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requisitionsService.remove(id);
  }

  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const file = await this.requisitionsService.generatePdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="requisicion-${id}.pdf"`,
    });
    return file;
  }

  @Get(':id/excel')
  async downloadExcel(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const file = await this.requisitionsService.generateExcel(id);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="requisicion-${id}.xlsx"`,
    });
    return file;
  }
}

