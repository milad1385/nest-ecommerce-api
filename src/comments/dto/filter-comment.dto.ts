import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CommentStatusEnum } from '../enums/comment-status.enum';
import { Type } from 'class-transformer';

export class FilterCommentDto {
  @IsOptional()
  @IsNumber({}, { message: 'صفحه باید یک عدد باشد' })
  @Min(1, { message: 'صفحه حداقل باید ۱ باشد' })
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber({}, { message: 'تعداد در هر صفحه باید یک عدد باشد' })
  @Min(1, { message: 'تعداد در هر صفحه حداقل باید ۱ باشد' })
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsNumber({}, { message: 'شناسه محصول باید یک عدد باشد' })
  @Type(() => Number)
  product_id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'شناسه فروشنده باید یک عدد باشد' })
  @Type(() => Number)
  seller_id?: number;

  @IsOptional()
  @IsNumber({}, { message: 'شناسه کاربر باید یک عدد باشد' })
  @Type(() => Number)
  user_id?: number;

  @IsOptional()
  @IsEnum(CommentStatusEnum, {
    message: `وضعیت باید یکی از مقادیر ${Object.values(CommentStatusEnum).join('، ')} باشد`,
  })
  status?: CommentStatusEnum;

  @IsOptional()
  @IsNumber({}, { message: 'حداقل امتیاز باید یک عدد باشد' })
  @Min(1, { message: 'حداقل امتیاز باید ۱ باشد' })
  @Type(() => Number)
  minRating?: number;

  @IsOptional()
  @IsNumber({}, { message: 'حداکثر امتیاز باید یک عدد باشد' })
  @Min(1, { message: 'حداکثر امتیاز باید ۱ باشد' })
  @Type(() => Number)
  maxRating?: number;

  @IsOptional()
  @IsString({ message: 'فیلد مرتب‌سازی باید یک متن باشد' })
  sortField?: string = 'created_at';

  @IsOptional()
  @IsString({ message: 'ترتیب مرتب‌سازی باید یک متن باشد' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
