import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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
}
