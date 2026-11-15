import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class DeleteRoleFromUser {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive({ message: 'عدد منفی وارد نکنید' })
  @IsInt({ message: 'عدد صحیح وارد کنید' })
  @IsNotEmpty({ message: 'آیدی کاربر را وارد کنید' })
  user_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive({ message: 'عدد منفی وارد نکنید' })
  @IsInt({ message: 'عدد صحیح وارد کنید' })
  @IsNotEmpty({ message: 'آیدی نقش را انتخاب کنید' })
  role_id: number;
}
