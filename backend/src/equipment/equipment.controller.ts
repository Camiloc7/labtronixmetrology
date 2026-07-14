import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards,
} from '@nestjs/common';
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
