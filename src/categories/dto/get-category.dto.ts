import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class GetCategoryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'شماره صفحه باید عدد باشد' })
  @IsPositive({ message: 'شماره صفحه باید بزرگتر از 0 باشد' })
  @IsInt({ message: 'شماره صفحه باید عدد صحیح باشد' })
  @Min(1, { message: 'حداقل شماره صفحه عدد 1 است' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'تعداد آیتم در هر صفحه باید عدد باشد' })
  @IsPositive({ message: 'تعداد آیتم باید بزرگتر از 0 باشد' })
  @IsInt({ message: 'تعداد آیتم باید عدد صحیح باشد' })
  @Min(1, { message: 'حداقل تعداد آیتم در هر صفحه 1 است' })
  @Max(100, { message: 'حداکثر تعداد آیتم در هر صفحه 100 است' })
  limit: number = 10;
}

export class GetCategorySlugDto {
  @MaxLength(150, {
    message: 'اسلاگ دسته بندی بیشتر از 150 کاراکتر نباید باشد',
  })
  @IsString({ message: 'اسلاگ دسته بندی باید رشته باشد' })
  @IsNotEmpty({ message: 'اسلاگ دسته بندی را وارد کنید' })
  slug: string;
}
