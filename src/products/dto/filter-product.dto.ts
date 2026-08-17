import {
    IsOptional,
    IsString,
    IsNumber,
    IsDate,
    IsBoolean,
    IsEnum,
    IsArray,
    IsInt,
    Min,
    Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum SortField {
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updated_at',
    TITLE = 'title',
    PRICE = 'price',
    ID = 'id',
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class FilterProductDto {
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

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    maxPrice?: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    inStock?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (!value) return [];
        if (typeof value === 'string') {
            return value.split(',').map(v => v.trim());
        }
        if (Array.isArray(value)) {
            return value.map(v => v.trim());
        }
        return [value];
    })
    categorySlugs?: string[];


    @IsOptional()
    @IsDate()
    @Type(() => Date)
    createdFrom?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    createdTo?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    updatedFrom?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    updatedTo?: Date;

    @IsOptional()
    @IsEnum(SortField)
    sortField: SortField = SortField.CREATED_AT;

    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder: SortOrder = SortOrder.DESC;


    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    isActive?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    isFeatured?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    hasDiscount?: boolean;
}