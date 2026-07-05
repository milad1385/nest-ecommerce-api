import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { UserRoleEnums } from '../enums/userRoleEnums';

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @Matches(/^.{11}$/, { message: 'شماره موبایل باید 11 رقم باشد' })
  @IsString({ message: 'موبایل باید یک رشته باشد' })
  @IsNotEmpty({ message: 'موبایل نمی تواند خالی باشد' })
  mobile: string;

  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'ایمیل معتبر نیست' })
  @IsNotEmpty({ message: 'ایمیل نمی تواند خالی باشد' })
  email: string;

  @IsString({ message: 'نام باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام نمی تواند خالی باشد' })
  display_name: string;

  @IsString({ message: 'نام کاربری باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام کاربری نمی تواند خالی باشد' })
  username: string;

  @IsOptional()
  @IsString({ message: 'رمز عبور باید یک رشته باشد' })
  @MinLength(8, { message: 'رمز عبور باید حداقل 8 کاراکتر باشد' })
  password: string;

  @IsEnum(UserRoleEnums, { message: 'نقش کاربر باید یا user باشد یا admin' })
  @IsOptional()
  role: UserRoleEnums;
}

export class GetUserDto {
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
  @IsEnum(UserRoleEnums, {
    message: 'وضعیت باید done , doing , cancel باشد',
  })
  @IsOptional()
  status: UserRoleEnums;
}

export class GetUserIdDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'شماره صفحه باید عدد صحیح باشد' })
  @IsPositive({ message: 'شماره کاربران باید بزرگتر از 0 باشد' })
  @IsNumber({}, { message: 'شماره کاربران باید عدد باشد' })
  id: number;
}
