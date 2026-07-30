import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProudctDto {
  @MaxLength(150, { message: 'حداکثر عنوان محصول باید 150 کاراکتر باشد' })
  @MinLength(3, { message: 'حداقل عنوان محصول باید 3 کاراکتر باشد' })
  @IsString({ message: 'عنوان محصول باید رشته باشد' })
  @IsNotEmpty({ message: 'عنوان محصول الزامی است' })
  title: string;

  @MaxLength(500, { message: 'حداکثر توضیح کوتاه محصول باید 500 کاراکتر باشد' })
  @MinLength(10, { message: 'حداقل توضیح کوتاه محصول باید 10 کاراکتر باشد' })
  @IsString({ message: 'توضیح کوتاه محصول باید رشته باشد' })
  @IsNotEmpty({ message: 'توضیح کوتاه محصول الزامی است' })
  shortDescription: string;

  @MaxLength(5000, { message: 'حداکثر توضیح محصول باید 5000 کاراکتر باشد' })
  @MinLength(10, { message: 'حداقل توضیح محصول باید 10 کاراکتر باشد' })
  @IsString({ message: 'توضیح محصول باید رشته باشد' })
  @IsNotEmpty({ message: 'توضیح محصول الزامی است' })
  description: string;

  @MaxLength(40, { message: 'حداکثر تعداد کاراکتر اسلاگ باید 40 باشد' })
  @MinLength(3, { message: 'حداقل تعداد کاراکتر اسلاگ باید 3 باشد' })
  @IsString({ message: 'عنوان اسلاگ باید رشته باشد' })
  @IsNotEmpty({ message: 'عنوان اسلاگ الزامی است' })
  slug: string;

  @IsOptional()
  @IsArray({ message: 'آیدی دسته بندی ها باید آرایه ای از اعداد باشد' })
  categoryIds: number[];
}
