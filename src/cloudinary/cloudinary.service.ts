import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    constructor(config: ConfigService) {
        cloudinary.config({
            cloud_name: config.getOrThrow('CLOUDINARY_CLOUD_NAME'),
            api_key: config.getOrThrow('CLOUDINARY_API_KEY'),
            api_secret: config.getOrThrow('CLOUDINARY_API_SECRET'),
        });
    }

    uploadImage(file: Express.Multer.File, folder = 'posts'): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder, resource_type: 'image' },
                (error, result) => {
                    if (error || !result) return reject(error ?? new Error('Upload failed'));
                    resolve(result);
                },
            );
            Readable.from(file.buffer).pipe(stream);
        });
    }

    deleteImage(publicId: string) {
        return cloudinary.uploader.destroy(publicId);
    }
}