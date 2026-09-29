import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export interface SingleFileUploadOptions {
  maxSize?: number;
  fileTypes?: RegExp;
}

export function SingleFileUploadInterceptor(
  fieldName: string,
  options: SingleFileUploadOptions = {},
) {
  const {
    maxSize = 5 * 1024 * 1024,
    fileTypes = /(jpg|jpeg|png|webp)$/,
  } = options;

  return FileInterceptor(fieldName, {
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