import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'deleter' })
  @IsNotEmpty({ message: 'اسم نقش را وارد کنید' })
  name: string;
}
