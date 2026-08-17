import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-proudct.dto';

import { IsObject, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsObject({ message: 'ویژگی‌ها باید یک شیء باشند' })
  attributes?: Record<string, string>;
}
