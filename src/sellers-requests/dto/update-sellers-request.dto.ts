import { PartialType } from '@nestjs/mapped-types';
import { CreateSellersRequestDto } from './create-sellers-request.dto';

export class UpdateSellersRequestDto extends PartialType(CreateSellersRequestDto) {}
