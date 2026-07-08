import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';

export class CreateAddressDto {
  @MinLength(2, { message: 'حداقل نام استان باید 2 کاراکتر باشد  ' })
  @MaxLength(100, { message: 'حداکثر نام استان باید 100 کاراکتر باشد  ' })
  @IsString({ message: 'استان باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام استان را وارد کنید' })
  province: string;

  @MinLength(2, { message: 'حداقل نام شهر باید 2 کاراکتر باشد  ' })
  @MaxLength(100, { message: 'حداکثر نام شهر باید 100 کاراکتر باشد  ' })
  @IsString({ message: 'شهر باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام شهر را وارد کنید' })
  city: string;

  @MinLength(2, { message: 'حداقل  آدرس باید 2 کاراکتر باشد  ' })
  @MaxLength(150, { message: 'حداکثر  آدرس باید 150 کاراکتر باشد  ' })
  @IsString({ message: 'آدرس باید یک رشته باشد' })
  @IsNotEmpty({ message: ' آدرس را وارد کنید' })
  address: string;

  @IsString({ message: 'کد پستی باید رشته باشد' })
  @IsNotEmpty({ message: ' کدپستی را وارد کنید' })
  @Matches(/^.{10}$/, { message: 'کد پستی باید 10 رقم باشد' })
  postal_code: string;

  @Transform(({ value }) => value.trim())
  @Matches(/^.{11}$/, { message: 'شماره موبایل باید 11 رقم باشد' })
  @IsString({ message: 'موبایل باید یک رشته باشد' })
  @IsNotEmpty({ message: 'موبایل نمی تواند خالی باشد' })
  receiver_mobile: string;

  @IsOptional()
  description?: string;
}
