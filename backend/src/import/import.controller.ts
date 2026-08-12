import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  assertExcelUpload,
  excelUploadOptions,
} from '../common/file-validation/upload-validation';

@ApiTags('Import')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
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
  @UseInterceptors(FileInterceptor('file', excelUploadOptions))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    assertExcelUpload(file);

    const result = await this.importService.processExcel(file.buffer);
    return {
      message: 'Archivo procesado con éxito',
      details: result,
    };
  }
}
