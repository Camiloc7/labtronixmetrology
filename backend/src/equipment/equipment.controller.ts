import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, Res, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Equipos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get('export')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  @ApiOperation({ summary: 'Exportar equipos a Excel' })
  async exportExcel(@Res() res: Response) {
    const buffer = await this.equipmentService.exportToExcel();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="equipos.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')
  @Roles('ADMIN', 'COMERCIAL')
  @ApiOperation({ summary: 'Importar equipos desde Excel' })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File, @CurrentUser('sub') userId: string) {
    if (!file) throw new BadRequestException('Archivo no proporcionado');
    return this.equipmentService.importFromExcel(file.buffer, userId);
  }

  @Get()
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  findAll(@Query('search') search?: string) {
    return this.equipmentService.findAll(search);
  }

  @Get(':id')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'COMERCIAL')
  create(@Body() dto: CreateEquipmentDto, @CurrentUser('sub') userId: string) {
    return this.equipmentService.create(dto, userId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COMERCIAL')
  update(@Param('id') id: string, @Body() dto: Partial<CreateEquipmentDto>) {
    return this.equipmentService.update(id, dto);
  }
}
