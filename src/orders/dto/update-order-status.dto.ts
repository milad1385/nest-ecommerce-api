import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty({ message: 'وضعیت الزامی است' })
  @IsEnum(OrderStatus, { message: 'وضعیت نامعتبر است' })
  status: OrderStatus;

  @IsOptional()
  @IsString({ message: 'دلیل باید متن باشد' })
  @MaxLength(500, { message: 'دلیل نباید بیشتر از ۵۰۰ کاراکتر باشد' })
  reason?: string;
}
