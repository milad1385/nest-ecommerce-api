import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { TicketStatusEnums } from '../enums/TicketStatusEnums';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @MaxLength(100, { message: 'عنوان تیکت بیشتر از 100 کاراکتر نمی تواند باشد' })
  @IsString({ message: 'عنوان تیکت باید رشته باشد' })
  @IsNotEmpty({ message: 'عنوان تیکت نمی تواند خالی باشد' })
  title: string;

  @MaxLength(100, { message: 'موضوع تیکت بیشتر از 100 کاراکتر نمی تواند باشد' })
  @IsString({ message: 'موضوع تیکت باید رشته باشد' })
  @IsNotEmpty({ message: 'موضوع تیکت نمی تواند خالی باشد' })
  subject: string;

  @MaxLength(2000, {
    message: 'عنوان تیکت بیشتر از 2000 کاراکتر نمی تواند باشد',
  })
  @IsString({ message: 'متن تیکت باید رشته باشد' })
  @IsNotEmpty({ message: 'متن تیکت نمی تواند خالی باشد' })
  description: string;

  @IsEnum(TicketStatusEnums, {
    message: 'وضعیت باید answered , pending , close باشد',
  })
  status: TicketStatusEnums = TicketStatusEnums.PENDING;

  @IsOptional()
  @IsNumber({}, { message: 'آیدی تیکت رپلای باید عدد باشد' })
  replyId: number;
}

export class GetTicketDto {
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
  @IsEnum(TicketStatusEnums, {
    message: 'وضعیت باید pending , answered , close باشد',
  })
  @IsOptional()
  status: TicketStatusEnums;
}
