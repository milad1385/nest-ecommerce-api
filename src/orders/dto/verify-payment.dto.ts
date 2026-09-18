import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class VerifyPaymentDto {
  @IsNotEmpty({ message: 'شناسه آدرس الزامی است' })
  @Type(() => Number)
  @IsInt({ message: 'شناسه سفارش باید عدد باشد' })
  orderId: number;

  @IsNotEmpty({ message: 'شناسه درگاه پرداخت الزامی است' })
  @Type(() => Number)
  @IsInt({ message: 'شناسه درگاه پرداخت باید عدد باشد' })
  trackId: number;
}
