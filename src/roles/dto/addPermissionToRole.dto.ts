import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class AddPermissionToRole {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: 'آیدی نقش را وارد کنید' })
  role_id: number;

  @ApiProperty({ example: 1 })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsNumber({}, { each: true })
  permission_ids: number[];
}
