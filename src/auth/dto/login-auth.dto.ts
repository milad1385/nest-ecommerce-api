import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) => value.trim())
  @Matches(/^.{11}$/, { message: 'شماره موبایل باید 11 رقم باشد' })
  @IsString({ message: 'موبایل باید یک رشته باشد' })
  @IsNotEmpty({ message: 'موبایل نمی تواند خالی باشد' })
  @ApiProperty({ example: '09331234567' })
  mobile: string;

  @IsString({ message: 'رمز عبور باید یک رشته باشد' })
  @MinLength(8, { message: 'رمز عبور باید حداقل 8 کاراکتر باشد' })
  @ApiProperty({ example: '12345678' })
  password: string;
}
