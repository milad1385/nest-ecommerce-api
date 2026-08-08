import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SellerRequestEnums } from '../enums/sellers-requests-status-enums';

export class UpdateSellerRequestStatusDto {
  @IsEnum(SellerRequestEnums, {
    message: `وضعیت باید یکی از مقادیر ${Object.values(SellerRequestEnums).join('، ')} باشد`,
  })
  status: SellerRequestEnums;

  @IsOptional()
  @IsString({ message: 'توضیحات ادمین باید رشته باشد' })
  adminComment: string;
}
