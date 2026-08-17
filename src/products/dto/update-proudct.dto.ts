import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-proudct.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
