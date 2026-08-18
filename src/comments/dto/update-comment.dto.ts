import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CommentStatusEnum } from '../enums/comment-status.enum';
import { Type } from 'class-transformer';

export class UpdateCommentDto {
  @IsOptional()
  @IsString({ message: 'متن کامنت باید یک متن باشد' })
  content?: string;

  @IsOptional()
  @IsNumber({}, { message: 'امتیاز باید یک عدد باشد' })
  @Min(1, { message: 'امتیاز حداقل باید ۱ باشد' })
  @Max(5, { message: 'امتیاز حداکثر باید ۵ باشد' })
  @Type(() => Number)
  rating?: number;

  @IsOptional()
  @IsEnum(CommentStatusEnum, {
    message: `وضعیت باید یکی از مقادیر ${Object.values(CommentStatusEnum).join('، ')} باشد`,
  })
  status?: CommentStatusEnum;

  @IsOptional()
  @IsString({ message: 'پاسخ ادمین باید یک متن باشد' })
  adminReply?: string;
}