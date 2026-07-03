import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRoleEnums } from '../enums/userRoleEnums';

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @Matches(/^.{11}$/, { message: 'شماره موبایل باید 11 رقم باشد' })
  @IsString({ message: 'موبایل باید یک رشته باشد' })
  @IsNotEmpty({ message: 'موبایل نمی تواند خالی باشد' })
  mobile: string;

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
  role: UserRoleEnums;
}
