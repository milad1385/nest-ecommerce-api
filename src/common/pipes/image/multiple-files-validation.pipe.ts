import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

export interface MultipleFilesValidationOptions {
  maxSize?: number;
  required?: boolean;
  maxCount?: number;
  fileTypes?: RegExp;
}

@Injectable()
export class MultipleFilesValidationPipe implements PipeTransform {
  private readonly options: Required<MultipleFilesValidationOptions>;

  constructor(options: MultipleFilesValidationOptions = {}) {
    this.options = {
      maxSize: options.maxSize ?? 5 * 1024 * 1024,
      required: options.required ?? false,
      maxCount: options.maxCount ?? 10,
      fileTypes: options.fileTypes ?? /(jpg|jpeg|png|webp)$/,
    };
  }

  transform(
    files: Express.Multer.File[] | undefined,
  ): Express.Multer.File[] {
    if (this.options.required && (!files || files.length === 0)) {
      throw new BadRequestException('حداقل یک فایل الزامی است');
    }

    if (!files || files.length === 0) return [];

    if (files.length > this.options.maxCount) {
      throw new BadRequestException(
        `حداکثر ${this.options.maxCount} فایل مجاز است`,
      );
    }

    for (const file of files) {
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

    return files;
  }
}