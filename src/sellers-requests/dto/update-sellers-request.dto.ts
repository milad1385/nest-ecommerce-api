import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SellerRequestEnums } from '../enums/sellers-requests-status-enums';

export class UpdateSellersRequestDto {
  @IsOptional()
  @IsNumber({}, { message: 'موجودی باید یک عدد معتبر باشد' })
  @Min(1, { message: 'موجودی حداقل باید ۱ باشد' })
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsNumber({}, { message: 'قیمت باید یک عدد معتبر باشد' })
  @Min(1, { message: 'قیمت حداقل باید ۱ باشد' })
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'تخفیف باید یک عدد معتبر باشد' })
  @Min(0, { message: 'تخفیف حداقل باید ۰ درصد باشد' })
  @Max(100, { message: 'تخفیف حداکثر باید ۱۰۰ درصد باشد' })
  @Type(() => Number)
  discount?: number;

  @IsOptional()
  @IsEnum(SellerRequestEnums, {
    message: `وضعیت باید یکی از مقادیر ${Object.values(SellerRequestEnums).join('، ')} باشد`,
  })
  status?: SellerRequestEnums;

  @IsOptional()
  @IsNumber({}, { message: 'اولویت باید یک عدد معتبر باشد' })
  @Min(1, { message: 'اولویت حداقل باید ۱ باشد' })
  @Max(10, { message: 'اولویت حداکثر باید ۱۰ باشد' })
  @Type(() => Number)
  priority?: number;

  @IsOptional()
  @IsString({ message: 'نظر ادمین باید یک متن معتبر باشد' })
  @MinLength(1, { message: 'نظر ادمین نمی‌تواند خالی باشد' })
  adminComment?: string;
}
