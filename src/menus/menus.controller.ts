import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  async create(
    @Res() res: Response,
    @Body() dto: CreateMenuDto,
  ) {
    const menu = await this.menusService.create(dto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'منو با موفقیت ساخته شد',
      data: menu,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const menus = await this.menusService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'لیست منوها با موفقیت دریافت شد',
      data: menus,
    });
  }

  @Get('flat')
  async findAllFlat(@Res() res: Response) {
    const menus = await this.menusService.findAllFlat();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'لیست منوها با موفقیت دریافت شد',
      data: menus,
    });
  }

  @Get('slug/:slug')
  async findBySlug(
    @Res() res: Response,
    @Param('slug') slug: string,
  ) {
    const menu = await this.menusService.findBySlug(slug);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'منو با موفقیت دریافت شد',
      data: menu,
    });
  }

  @Get(':id')
  async findOne(
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    const menu = await this.menusService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'منو با موفقیت دریافت شد',
      data: menu,
    });
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() dto: UpdateMenuDto,
  ) {
    const menu = await this.menusService.update(+id, dto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'منو با موفقیت بروزرسانی شد',
      data: menu,
    });
  }

  @Delete(':id')
  async remove(
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    const result = await this.menusService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: null,
    });
  }
}