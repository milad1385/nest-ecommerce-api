import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export interface MultipleFilesUploadOptions {
  maxSize?: number;
  fileTypes?: RegExp;
}

export function MultipleFilesUploadInterceptor(
  fieldName: string,
  maxCount: number = 10,
  options: MultipleFilesUploadOptions = {},
) {
  const {
    maxSize = 5 * 1024 * 1024,
    fileTypes = /(jpg|jpeg|png|webp)$/,
  } = options;

  return FilesInterceptor(fieldName, maxCount, {
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