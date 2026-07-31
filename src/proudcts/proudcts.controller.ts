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
import { ProudctsService } from './proudcts.service';
import { CreateProudctDto } from './dto/create-proudct.dto';
import { UpdateProudctDto } from './dto/update-proudct.dto';
import type { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';
import { FilterProductDto } from './dto/filter-product.dto';

@Controller('proudcts')
export class ProudctsController {
  constructor(private readonly proudctsService: ProudctsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  async create(
    @Res() res: Response,
    @Body() createProudctDto: CreateProudctDto,
  ) {
    const product = await this.proudctsService.create(createProudctDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'محصول با موفقیت ساخته شد',
      data: product,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Query() filterDto: FilterProductDto) {
    const result = await this.proudctsService.findAll(filterDto);

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: 'محصولات با موفقیت دریافت شدند',
      data: result.items,
      meta: result.meta,
    });
  }

  @Get('category/:slug')
  async findByCategorySlug(
    @Res() res: Response,
    @Param('slug') slug: string,
    @Query() filterDto: FilterProductDto,
  ) {
    const result = await this.proudctsService.findByCategorySlug(
      slug,
      filterDto,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: `محصولات دسته‌بندی "${slug}" با موفقیت دریافت شدند`,
      data: result.items,
      meta: result.meta,
    });
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.proudctsService.findOneBySlug(slug);

    return {
      statusCode: 200,
      message: 'محصول با موفقیت دریافت شد',
      data: product,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProudctDto: UpdateProudctDto) {
    return this.proudctsService.update(+id, updateProudctDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proudctsService.remove(+id);
  }
}
