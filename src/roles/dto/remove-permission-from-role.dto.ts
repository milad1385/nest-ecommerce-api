import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class RemovePermissionFromRoleDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  role_id: number;

  @ApiProperty({ example: 1 })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true , message :"آیدی باید یک عدد باشد" })
  permission_ids: number[];
}
