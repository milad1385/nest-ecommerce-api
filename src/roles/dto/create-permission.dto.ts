import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'user.create' })
  @IsNotEmpty({ message: 'اسم مجوز را وارد کنید' })
  name: string | string[];
}
