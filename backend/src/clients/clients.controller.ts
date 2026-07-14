import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('search') search?: string) {
    return this.clientsService.findAll(search);
  }

  @Get(':id')
  @Roles('ADMIN', 'COMERCIAL', 'TECNICO')
  @ApiOperation({ summary: 'Detalle de cliente' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'COMERCIAL')
  @ApiOperation({ summary: 'Crear cliente' })
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COMERCIAL')
  @ApiOperation({ summary: 'Actualizar cliente' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Desactivar cliente' })
  deactivate(@Param('id') id: string) {
    return this.clientsService.deactivate(id);
  }
}
