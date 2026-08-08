import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SellerRequestEnums } from '../enums/sellers-requests-status-enums';

export class GetSellersRequestsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value) || 1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value) || 10)
  limit: number = 10;

  @IsEnum(SellerRequestEnums, {
    message: 'وضعیت باید accept , reject , pending باشد',
  })
  @IsOptional()
  status: SellerRequestEnums;
}
