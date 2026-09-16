import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuDto {
  @IsString({ message: 'عنوان باید متن باشد' })
  @IsNotEmpty({ message: 'عنوان الزامی است' })
  @MinLength(2, { message: 'عنوان باید حداقل ۲ کاراکتر باشد' })
  @MaxLength(100, { message: 'عنوان نباید بیشتر از ۱۰۰ کاراکتر باشد' })
  title: string;

  @IsString({ message: 'اسلاگ باید متن باشد' })
  @IsNotEmpty({ message: 'اسلاگ الزامی است' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'اسلاگ فقط می‌تواند شامل حروف کوچک، اعداد و خط تیره باشد',
  })
  @MaxLength(120, { message: 'اسلاگ نباید بیشتر از ۱۲۰ کاراکتر باشد' })
  slug: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'شناسه والد باید عدد باشد' })
  parent_id?: number | null;
}
