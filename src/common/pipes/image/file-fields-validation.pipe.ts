import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

export interface FileFieldRule {
  name: string;
  required?: boolean;
  maxCount?: number;
}

export interface FileFieldsValidationOptions {
  fields: FileFieldRule[];
  maxSize?: number;
  fileTypes?: RegExp;
}

@Injectable()
export class FileFieldsValidationPipe implements PipeTransform {
  private readonly options: Required<
    Omit<FileFieldsValidationOptions, 'fields'>
  > & {
    fields: FileFieldRule[];
  };

  constructor(options: FileFieldsValidationOptions) {
    this.options = {
      fields: options.fields,
      maxSize: options.maxSize ?? 5 * 1024 * 1024,
      fileTypes: options.fileTypes ?? /(jpg|jpeg|png|webp)$/,
    };
  }

  transform(
    files: Record<string, Express.Multer.File[]> | undefined,
  ): Record<string, Express.Multer.File[]> {
    const result: Record<string, Express.Multer.File[]> = {};

    for (const field of this.options.fields) {
      const fieldFiles = files?.[field.name] ?? [];

      if (field.required && fieldFiles.length === 0) {
        throw new BadRequestException(`فایل ${field.name} الزامی است`);
      }

      if (field.maxCount && fieldFiles.length > field.maxCount) {
        throw new BadRequestException(
          `حداکثر ${field.maxCount} فایل برای ${field.name} مجاز است`,
        );
      }

      for (const file of fieldFiles) {
        if (file.size > this.options.maxSize) {
          throw new BadRequestException(
            `حجم فایل ${file.originalname} بیش از حد مجاز است`,
          );
        }

        if (!this.options.fileTypes.test(file.mimetype)) {
          throw new BadRequestException(
            `فرمت فایل ${file.originalname} پشتیبانی نمی‌شود`,
          );
        }

        if (!file.buffer || file.buffer.length === 0) {
          throw new BadRequestException(`فایل ${file.originalname} خالی است`);
        }
      }

      result[field.name] = fieldFiles;
    }

    return result;
  }
}