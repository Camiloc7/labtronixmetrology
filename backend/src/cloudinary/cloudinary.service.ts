import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  uploadImage(file: Express.Multer.File, folder: string = 'labtronix/equipment'): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          type: 'authenticated', // Mantiene la foto privada (solo accesible con firma)
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  deleteImage(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, { type: 'authenticated' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  generateSignedUrl(publicId: string): string {
    // Genera una URL que expira en 1 hora (3600 segundos) o usa firma nativa
    return cloudinary.url(publicId, {
      type: 'authenticated',
      sign_url: true,
      secure: true,
    });
  }
}
