import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CancelOrderDto {
  @IsNotEmpty({ message: 'دلیل لغو الزامی است' })
  @IsString({ message: 'دلیل باید متن باشد' })
  @MaxLength(500, { message: 'دلیل نباید بیشتر از ۵۰۰ کاراکتر باشد' })
  reason: string;
}