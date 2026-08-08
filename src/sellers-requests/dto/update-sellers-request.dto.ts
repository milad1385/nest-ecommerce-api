import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class UpdateSellersRequestDto {
  @IsOptional()
  @IsNumber({}, { message: 'موجودی باید یک عدد معتبر باشد' })
  @Min(1, { message: 'موجودی حداقل باید ۱ باشد' })
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsNumber({}, { message: 'قیمت باید یک عدد معتبر باشد' })
  @Min(1, { message: 'قیمت حداقل باید ۱ باشد' })
  @IsPositive({ message: 'قیمت نمی تواند منفی باشد' })
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'تخفیف باید یک عدد معتبر باشد' })
  @Min(0, { message: 'تخفیف حداقل باید ۰ درصد باشد' })
  @Max(100, { message: 'تخفیف حداکثر باید ۱۰۰ درصد باشد' })
  @Type(() => Number)
  discount?: number;
}
