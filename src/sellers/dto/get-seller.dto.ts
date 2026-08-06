import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    Max,
    Min,
} from 'class-validator';
import { SellerStatusEnums } from '../enums/sellerStatusEnums.enum';

export class GetSellerDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'شماره صفحه باید عدد باشد' })
  @IsPositive({ message: 'شماره صفحه باید بزرگتر از 0 باشد' })
  @IsInt({ message: 'شماره صفحه باید عدد صحیح باشد' })
  @Min(1, { message: 'حداقل شماره صفحه عدد 1 است' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'تعداد آیتم در هر صفحه باید عدد باشد' })
  @IsPositive({ message: 'تعداد آیتم باید بزرگتر از 0 باشد' })
  @IsInt({ message: 'تعداد آیتم باید عدد صحیح باشد' })
  @Min(1, { message: 'حداقل تعداد آیتم در هر صفحه 1 است' })
  @Max(100, { message: 'حداکثر تعداد آیتم در هر صفحه 100 است' })
  limit: number = 10;
  @IsEnum(SellerStatusEnums, {
    message: 'وضعیت باید reject , pending , accept باشد',
  })
  @IsOptional()
  status: SellerStatusEnums;
}
