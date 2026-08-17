import { IsObject } from 'class-validator';

export class AddAttributesDto {
  @IsObject({ message: 'ویژگی‌ها باید یک شیء باشند' })
  attributes: Record<string, string>;
}
