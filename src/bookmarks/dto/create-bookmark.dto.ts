import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBookmarkDto {
  @IsInt({ message: 'آیدی محصول باید عدد باشد' })
  @IsPositive({ message: 'آیدی محصول باید عدد مثبت باشد' })
  @IsNotEmpty({ message: 'وارد کردن آیدی محصول الزامی است' })
  product_id: number;

  @IsOptional()
  @IsString({ message: 'متن یادداشت باید از نوع متن باشد' })
  @MaxLength(500)
  note?: string;
}
