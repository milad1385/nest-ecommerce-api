import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

export interface SingleFileValidationOptions {
  maxSize?: number;
  required?: boolean;
  fileTypes?: RegExp;
}

@Injectable()
export class SingleFileValidationPipe implements PipeTransform {
  private readonly options: Required<SingleFileValidationOptions>;

  constructor(options: SingleFileValidationOptions = {}) {
    this.options = {
      maxSize: options.maxSize ?? 5 * 1024 * 1024,
      required: options.required ?? true,
      fileTypes: options.fileTypes ?? /(jpg|jpeg|png|webp)$/,
    };
  }

  transform(
    file: Express.Multer.File | undefined,
  ): Express.Multer.File | undefined {
    if (this.options.required && !file) {
      throw new BadRequestException('فایل الزامی است');
    }

    if (!file) return undefined;

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

    return file;
  }
}