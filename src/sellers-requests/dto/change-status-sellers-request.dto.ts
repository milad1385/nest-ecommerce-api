import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { SellerRequestEnums } from '../enums/sellers-requests-status-enums';

export class ChangeStatusSellersRequestDto {
  @IsEnum(SellerRequestEnums, {
    message: `وضعیت باید یکی از مقادیر ${Object.values(SellerRequestEnums).join('، ')} باشد`,
  })
  status: SellerRequestEnums;

  @IsOptional()
  @IsString({ message: 'نظر ادمین باید یک متن معتبر باشد' })
  @MinLength(1, { message: 'نظر ادمین نمی‌تواند خالی باشد' })
  adminComment?: string;
}
