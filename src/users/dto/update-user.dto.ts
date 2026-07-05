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

export class UpdateUserDto {
  @IsString({ message: 'نام باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام نمی تواند خالی باشد' })
  @IsOptional()
  display_name: string;

  @IsEnum(UserRoleEnums, { message: 'نقش کاربر باید یا user باشد یا admin' })
  @IsOptional()
  role: UserRoleEnums;
}
