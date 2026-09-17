import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum QuantityAction {
  INCREASE = 'increase',
  DECREASE = 'decrease',
}

export class UpdateQuantityDto {
  @IsNotEmpty({ message: 'عملیات الزامی است' })
  @IsEnum(QuantityAction, { message: 'عملیات باید increase یا decrease باشد' })
  action: QuantityAction;
}