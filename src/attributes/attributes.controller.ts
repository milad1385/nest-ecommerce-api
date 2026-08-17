import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Controller('attributes')
export class AttributesController {
  constructor(private attributesService: AttributesService) {}

  @Post()
  async create(@Res() res: Response, @Body() dto: CreateAttributeDto) {
    const data = await this.attributesService.create(dto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'ویژگی با موفقیت ایجاد شد',
      data,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const data = await this.attributesService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'لیست ویژگی‌ها',
      data,
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: number) {
    const data = await this.attributesService.findOne(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'ویژگی پیدا شد',
      data,
    });
  }

  @Get('name/:name')
  async findByName(@Res() res: Response, @Param('name') name: string) {
    const data = await this.attributesService.findByName(name);

    if (!data) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: `ویژگی "${name}" یافت نشد`,
      });
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'ویژگی پیدا شد',
      data,
    });
  }

  @Get('filter/searchable')
  async findSearchable(@Res() res: Response) {
    const data = await this.attributesService.findSearchable();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'ویژگی‌های قابل جستجو',
      data,
    });
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() dto: UpdateAttributeDto,
  ) {
    const data = await this.attributesService.update(id, dto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'ویژگی با موفقیت بروزرسانی شد',
      data,
    });
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: number) {
    await this.attributesService.remove(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'ویژگی با موفقیت حذف شد',
    });
  }
}
