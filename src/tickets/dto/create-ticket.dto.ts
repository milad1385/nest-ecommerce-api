import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TicketStatusEnums } from '../enums/TicketStatusEnums';

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
  status: TicketStatusEnums = TicketStatusEnums.PENDING
}
