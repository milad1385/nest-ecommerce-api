import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';

export class QueryOrderDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'شماره صفحه باید عدد باشد' })
  @Min(1, { message: 'شماره صفحه باید حداقل ۱ باشد' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'تعداد در هر صفحه باید عدد باشد' })
  @Min(1, { message: 'تعداد در هر صفحه باید حداقل ۱ باشد' })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'وضعیت نامعتبر است' })
  status?: OrderStatus;
}
