import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RequisitionsService } from './requisitions.service';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { UpdateRequisitionDto } from './dto/update-requisition.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('requisitions')
export class RequisitionsController {
  constructor(private readonly requisitionsService: RequisitionsService) {}

  @Post()
  @Roles('ADMIN', 'COMERCIAL')
  create(@Body() createRequisitionDto: CreateRequisitionDto) {
    return this.requisitionsService.create(createRequisitionDto);
  }

  @Get()
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.requisitionsService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  findOne(@Param('id') id: string) {
    return this.requisitionsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COMERCIAL')
  update(
    @Param('id') id: string,
    @Body() updateRequisitionDto: UpdateRequisitionDto,
  ) {
    return this.requisitionsService.update(id, updateRequisitionDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.requisitionsService.remove(id);
  }

  @Get(':id/pdf')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  async downloadPdf(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.requisitionsService.generatePdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="requisicion-${id}.pdf"`,
    });
    return file;
  }

  @Get(':id/excel')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  async downloadExcel(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.requisitionsService.generateExcel(id);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="requisicion-${id}.xlsx"`,
    });
    return file;
  }
}
