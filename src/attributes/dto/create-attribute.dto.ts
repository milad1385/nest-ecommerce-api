import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AttributeTypeEnum } from '../enums/attribute-type.enum';
import { Type } from 'class-transformer';

export class CreateAttributeDto {
  @IsString({ message: 'نام ویژگی باید یک متن باشد' })
  name: string;

  @IsOptional()
  @IsString({ message: 'نام نمایشی باید یک متن باشد' })
  displayName?: string;

  @IsOptional()
  @IsString({ message: 'واحد باید یک متن باشد' })
  unit?: string;

  @IsEnum(AttributeTypeEnum, {
    message: `نوع باید یکی از این مقادیر باشد: ${Object.values(AttributeTypeEnum).join(', ')}`,
  })
  type: AttributeTypeEnum;

  @IsOptional()
  @IsBoolean({ message: 'isSearchable باید true یا false باشد' })
  isSearchable?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isFilterable باید true یا false باشد' })
  isFilterable?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isRequired باید true یا false باشد' })
  isRequired?: boolean;

  @IsOptional()
  @IsArray({ message: 'گزینه‌ها باید یک آرایه باشند' })
  @IsString({ each: true, message: 'هر گزینه باید یک متن باشد' })
  options?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'ترتیب نمایش باید یک عدد باشد' })
  @Min(0, { message: 'ترتیب نمایش نباید منفی باشد' })
  @Type(() => Number)
  sortOrder?: number;

  @IsOptional()
  @IsString({ message: 'توضیحات باید یک متن باشد' })
  description?: string;
}
