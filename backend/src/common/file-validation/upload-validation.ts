import { BadRequestException } from '@nestjs/common';
import type { Options } from 'multer';

const MB = 1024 * 1024;
// Multer stores these files in memory. Keep an absolute ceiling even when a
// local operator raises the configurable limits.
const HARD_MAX_UPLOAD_MB = 250;
const HARD_MAX_UPLOAD_BYTES = HARD_MAX_UPLOAD_MB * MB;
const DEFAULT_EXCEL_MAX_MB = 100;
const DEFAULT_IMAGE_MAX_MB = 50;

function getConfiguredLimitMb(name: string, defaultValue: number): number {
  const value = Number(process.env[name] ?? defaultValue);
  if (!Number.isFinite(value) || value <= 0) {
    return defaultValue;
  }

  return Math.min(Math.floor(value), HARD_MAX_UPLOAD_MB);
}

function isAllowedExtension(name: string, extensions: readonly string[]): boolean {
  const lowerName = name.toLowerCase();
  return extensions.some((extension) => lowerName.endsWith(extension));
}

function assertWithinConfiguredLimit(file: Express.Multer.File, name: string, defaultValue: number): void {
  const maxMb = getConfiguredLimitMb(name, defaultValue);
  if (file.size > maxMb * MB) {
    throw new BadRequestException(`El archivo supera el limite configurado de ${maxMb} MB`);
  }
}

export const excelUploadOptions: Options = {
  limits: { fileSize: HARD_MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (_request, file, callback) => {
    callback(null, isAllowedExtension(file.originalname, ['.xlsx']));
  },
};

export const imageUploadOptions: Options = {
  limits: { fileSize: HARD_MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (_request, file, callback) => {
    callback(null, isAllowedExtension(file.originalname, ['.jpg', '.jpeg', '.png', '.webp']));
  },
};

export function assertExcelUpload(
  file: Express.Multer.File | undefined,
): asserts file is Express.Multer.File {
  if (!file) {
    throw new BadRequestException('Se requiere un archivo .xlsx valido');
  }
  assertWithinConfiguredLimit(file, 'UPLOAD_MAX_EXCEL_MB', DEFAULT_EXCEL_MAX_MB);

  // XLSX files are ZIP containers. ExcelJS validates their internal structure afterwards.
  const isZip =
    file.buffer.length >= 4 &&
    file.buffer[0] === 0x50 &&
    file.buffer[1] === 0x4b &&
    (file.buffer[2] === 0x03 || file.buffer[2] === 0x05 || file.buffer[2] === 0x07) &&
    (file.buffer[3] === 0x04 || file.buffer[3] === 0x06 || file.buffer[3] === 0x08);
  if (!isZip) {
    throw new BadRequestException('El archivo no tiene un formato .xlsx valido');
  }
}

export function assertImageUpload(
  file: Express.Multer.File | undefined,
): asserts file is Express.Multer.File {
  if (!file) {
    throw new BadRequestException('Se requiere una imagen JPEG, PNG o WebP valida');
  }
  assertWithinConfiguredLimit(file, 'UPLOAD_MAX_IMAGE_MB', DEFAULT_IMAGE_MAX_MB);

  const bytes = file.buffer;
  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isWebp =
    bytes.length >= 12 &&
    bytes.subarray(0, 4).equals(Buffer.from('RIFF')) &&
    bytes.subarray(8, 12).equals(Buffer.from('WEBP'));
  if (!isJpeg && !isPng && !isWebp) {
    throw new BadRequestException('El contenido del archivo no es una imagen permitida');
  }
}
