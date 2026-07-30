import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';
import { GetCategoryDto, GetCategorySlugDto } from './dto/get-category.dto';
import { createPagination } from 'utils/func';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  async create(
    @Res() res: Response,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const category = await this.categoriesService.create(createCategoryDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'دسته بندی با موفقیت ساخته شد',
      data: category,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const categories = await this.categoriesService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'دسته بندی ها با موفقیت دریافت شد',
      data: categories,
    });
  }
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  async find(@Res() res: Response, @Query() getCategoryDto: GetCategoryDto) {
    const { page, limit } = getCategoryDto;
    const { categories, count } =
      await this.categoriesService.find(getCategoryDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'دسته بندی ها با موفقیت دریافت شد',
      data: {
        categories,
        pagination: createPagination(page, limit, count, 'Categories'),
      },
    });
  }

  @Get(':slug')
  async findOne(@Res() res: Response, @Param() { slug }: GetCategorySlugDto) {
    const category = await this.categoriesService.findOne(slug);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'دسته بندی با موفقیت دریافت شد',
      data: category,
    });
  }

  @Patch(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.update(
      +id,
      updateCategoryDto,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'دسته بندی با موفقیت آپدیت شد',
      data: category,
    });
  }

  @Delete(':slug')
  async remove(@Res() res: Response, @Param() { slug }: GetCategorySlugDto) {
    const category = await this.categoriesService.remove(slug);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'دسته بندی با موفقیت حذف شد',
      data: category,
    });
  }
}
