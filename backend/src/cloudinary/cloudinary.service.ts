import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly configured: boolean;

  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    this.configured = Boolean(
      cloudName?.trim() && apiKey?.trim() && apiSecret?.trim(),
    );

    if (this.configured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    } else {
      this.logger.warn(
        'Cloudinary no está configurado (faltan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY o CLOUDINARY_API_SECRET). Las fotos de equipos no estarán disponibles.',
      );
    }
  }

  isConfigured(): boolean {
    return this.configured;
  }

  private assertConfigured(): void {
    if (!this.configured) {
      throw new ServiceUnavailableException(
        'El almacenamiento de fotos no está configurado. Contacte al administrador para habilitar Cloudinary.',
      );
    }
  }

  uploadImage(
    file: Express.Multer.File,
    folder: string = 'labtronix/equipment',
  ): Promise<any> {
    return this.uploadFile(file, folder, 'image');
  }

  uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'raw' | 'auto' = 'auto',
  ): Promise<any> {
    this.assertConfigured();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          type: 'authenticated',
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  deleteImage(publicId: string, resourceType: 'image' | 'raw' | 'auto' = 'image'): Promise<any> {
    this.assertConfigured();

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { type: 'authenticated', resource_type: resourceType },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }

  generateSignedUrl(publicId: string, resourceType: 'image' | 'raw' | 'video' = 'image'): string {
    if (!this.configured || !publicId) return '';

    return cloudinary.url(publicId, {
      type: 'authenticated',
      sign_url: true,
      secure: true,
      resource_type: resourceType,
    });
  }
}
