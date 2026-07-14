import { Controller, Get, Post, Patch, Body, Param, UseGuards, UseInterceptors, UploadedFile, Res, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmailRequestsService } from './email-requests.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsOptional, IsString, IsUUID } from 'class-validator';

class CreateEmailRequestDto {
  @IsString()
  rawContent: string;
}

class ProcessEmailRequestDto {
  @IsOptional()
  @IsUUID()
  clientId?: string;
}

@ApiTags('Solicitudes Email')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('email-requests')
export class EmailRequestsController {
  constructor(private readonly emailRequestsService: EmailRequestsService) {}

  @Get('export')
  @Roles('ADMIN', 'COMERCIAL')
  @ApiOperation({ summary: 'Exportar solicitudes a Excel' })
  async exportExcel(@Res() res: Response) {
    const buffer = await this.emailRequestsService.exportToExcel();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="solicitudes-email.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')
  @Roles('ADMIN', 'COMERCIAL')
  @ApiOperation({ summary: 'Importar solicitudes desde Excel' })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Archivo no proporcionado');
    return this.emailRequestsService.importFromExcel(file.buffer);
  }

  @Get()
  @Roles('ADMIN', 'COMERCIAL')
  findAll() {
    return this.emailRequestsService.findAll();
  }

  @Post()
  @Roles('ADMIN', 'COMERCIAL')
  create(@Body() body: CreateEmailRequestDto) {
    return this.emailRequestsService.create(body.rawContent);
  }

  @Patch(':id/process')
  @Roles('ADMIN', 'COMERCIAL')
  process(
    @Param('id') id: string,
    @Body() body: ProcessEmailRequestDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.emailRequestsService.process(id, userId, body.clientId);
  }

  @Patch(':id/discard')
  @Roles('ADMIN', 'COMERCIAL')
  discard(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.emailRequestsService.discard(id, userId);
  }
}
