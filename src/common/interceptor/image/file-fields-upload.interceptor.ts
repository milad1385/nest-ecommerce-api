import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export interface FileFieldConfig {
  name: string;
  maxCount: number;
}

export interface FileFieldsUploadOptions {
  maxSize?: number;
  fileTypes?: RegExp;
}

export function FileFieldsUploadInterceptor(
  fields: FileFieldConfig[],
  options: FileFieldsUploadOptions = {},
) {
  const {
    maxSize = 5 * 1024 * 1024,
    fileTypes = /(jpg|jpeg|png|webp)$/,
  } = options;

  return FileFieldsInterceptor(fields, {
    storage: memoryStorage(),
    limits: { fileSize: maxSize },
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(fileTypes)) {
        return callback(new Error('فرمت فایل پشتیبانی نمی‌شود'), false);
      }
      callback(null, true);
    },
  });
}