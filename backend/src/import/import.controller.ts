import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Import')
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('excel')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Archivo no proporcionado');
    }

    if (!file.originalname.match(/\.(xlsx)$/)) {
      throw new BadRequestException('Solo se permiten archivos de Excel (.xlsx)');
    }

    const result = await this.importService.processExcel(file.buffer);
    return {
      message: 'Archivo procesado con éxito',
      details: result,
    };
  }
}
