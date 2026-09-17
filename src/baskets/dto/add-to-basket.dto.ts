import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToBasketDto {
  @IsNotEmpty({ message: 'شناسه محصول فروشنده الزامی است' })
  @Type(() => Number)
  @IsInt({ message: 'شناسه محصول فروشنده باید عدد باشد' })
  productSellerId: number;

  @IsNotEmpty({ message: 'تعداد الزامی است' })
  @Type(() => Number)
  @IsInt({ message: 'تعداد باید عدد باشد' })
  @Min(1, { message: 'تعداد باید حداقل ۱ باشد' })
  quantity: number;
}