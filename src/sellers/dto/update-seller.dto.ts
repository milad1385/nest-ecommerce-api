import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { SellerStatusEnums } from '../enums/sellerStatusEnums.enum';

export class UpdateSellerDto {
  @IsOptional()
  @IsString({
    message: 'نام فروشنده باید متن باشد',
  })
  @MinLength(3, {
    message: 'نام فروشنده باید حداقل ۳ کاراکتر باشد',
  })
  @MaxLength(100, {
    message: 'نام فروشنده نباید بیشتر از ۱۰۰ کاراکتر باشد',
  })
  name?: string;

  @IsOptional()
  @IsPhoneNumber('IR', {
    message: 'شماره تلفن معتبر نیست (مثال: ۰۹۱۲۱۲۳۴۵۶۷)',
  })
  phone?: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'ایمیل معتبر نیست (مثال: example@gmail.com)',
    },
  )
  email?: string;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'کد پستی باید عدد باشد',
    },
  )
  @Min(1000000000, {
    message: 'کد پستی باید ۱۰ رقم باشد (مثال: ۱۲۳۴۵۶۷۸۹۰)',
  })
  postal_code?: number;

  @IsOptional()
  @IsString({
    message: 'استان باید متن باشد',
  })
  @MaxLength(50, {
    message: 'نام استان نباید بیشتر از ۵۰ کاراکتر باشد',
  })
  province?: string;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'شناسه کاربر باید عدد باشد',
    },
  )
  @Min(1, {
    message: 'شناسه کاربر معتبر نیست',
  })
  userId?: number;

  @IsOptional()
  userRole?: string;
}
