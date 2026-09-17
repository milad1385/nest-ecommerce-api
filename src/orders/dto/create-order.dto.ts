import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'شناسه آدرس الزامی است' })
  @Type(() => Number)
  @IsInt({ message: 'شناسه آدرس باید عدد باشد' })
  addressId: number;

  @IsOptional()
  @IsString({ message: 'روش پرداخت باید متن باشد' })
  @MaxLength(50, { message: 'روش پرداخت نباید بیشتر از ۵۰ کاراکتر باشد' })
  paymentMethod?: string;

  @IsOptional()
  @IsString({ message: 'یادداشت باید متن باشد' })
  @MaxLength(500, { message: 'یادداشت نباید بیشتر از ۵۰۰ کاراکتر باشد' })
  note?: string;
}