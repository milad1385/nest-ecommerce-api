import { PartialType } from '@nestjs/mapped-types';
import { CreateProudctDto } from './create-proudct.dto';

export class UpdateProudctDto extends PartialType(CreateProudctDto) {}
