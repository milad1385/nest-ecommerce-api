import { IsEnum, IsNotEmpty } from 'class-validator';
import { SellerStatusEnums } from '../enums/sellerStatusEnums.enum';

export class UpdateSellerStatusDto {
  @IsNotEmpty({ message: 'وضعیت الزامی است' })
  @IsEnum(SellerStatusEnums, {
    message:
      'وضعیت معتبر نیست. مقادیر مجاز: PENDING, REJECT, ACCEPT',
  })
  status: SellerStatusEnums;
}
