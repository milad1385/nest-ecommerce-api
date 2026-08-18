import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'متن کامنت الزامی است' })
  @IsString({ message: 'متن کامنت باید یک متن باشد' })
  @MinLength(3, { message: 'متن کامنت حداقل باید ۳ کاراکتر باشد' })
  content: string;

  @IsNotEmpty({ message: 'امتیاز الزامی است' })
  @IsNumber({}, { message: 'امتیاز باید یک عدد باشد' })
  @Min(1, { message: 'امتیاز حداقل باید ۱ باشد' })
  @Max(5, { message: 'امتیاز حداکثر باید ۵ باشد' })
  @Type(() => Number)
  rating: number;

  @IsNotEmpty({ message: 'شناسه محصول الزامی است' })
  @IsNumber({}, { message: 'شناسه محصول باید یک عدد باشد' })
  @Type(() => Number)
  product_id: number;

  @IsOptional()
  @IsNumber({}, { message: 'شناسه فروشنده باید یک عدد باشد' })
  @Type(() => Number)
  seller_id?: number;
}