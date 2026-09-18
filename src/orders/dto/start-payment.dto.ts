import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class StartPaymentDto {
  @IsNotEmpty({ message: 'شناسه آدرس الزامی است' })
  @Type(() => Number)
  @IsInt({ message: 'شناسه سفارش باید عدد باشد' })
  orderId: number;
}
