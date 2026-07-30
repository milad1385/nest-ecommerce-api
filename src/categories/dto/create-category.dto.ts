import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @MaxLength(40, { message: 'حداکثر تعداد کاراکتر دسته بندی باید 40 باشد' })
  @MinLength(3, { message: 'حداقل تعداد کاراکتر دسته بندی باید 3 باشد' })
  @IsString({ message: 'عنوان دسته بندی باید رشته باشد' })
  @IsNotEmpty({ message: 'عنوان دسته بندی الزامی است' })
  title: string;

  @MaxLength(40, { message: 'حداکثر تعداد کاراکتر اسلاگ باید 40 باشد' })
  @MinLength(3, { message: 'حداقل تعداد کاراکتر اسلاگ باید 3 باشد' })
  @IsString({ message: 'عنوان اسلاگ باید رشته باشد' })
  @IsNotEmpty({ message: 'عنوان اسلاگ الزامی است' })
  slug: string;

  @MaxLength(100, { message: 'حداکثر تعداد کاراکتر توضیحات باید 100 باشد' })
  @MinLength(3, { message: 'حداقل تعداد کاراکتر توضیحات باید 3 باشد' })
  @IsString({ message: 'عنوان توضیحات باید رشته باشد' })
  @IsNotEmpty({ message: 'عنوان توضیحات الزامی است' })
  description: string;

  @IsPositive({ message: 'آیدی پرنت باید عدد مثبت باشد' })
  @IsInt({ message: 'آیدی پرنت باید یک عدد صحیح باشد' })
  @IsOptional()
  parentId: number;
}
