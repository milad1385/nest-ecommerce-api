import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';
import { createPagination } from 'utils/func';
import { AddAttributesDto } from './dto/add-attributes.dto';
import { CreateProductDto } from './dto/create-proudct.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-proudct.dto';
import { ProductAttributeService } from './product-attribute.service';
import { ProductsService } from './products.service';

@Controller('Products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  async create(
    @Res() res: Response,
    @Body() createProductDto: CreateProductDto,
  ) {
    const product = await this.productsService.create(createProductDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'محصول با موفقیت ساخته شد',
      data: product,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Query() query: any) {
    const { items, count } = await this.productsService.findAll(query);
    const { page = 1, limit = 10 } = query;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'محصولات با موفقیت دریافت شدند',
      data: {
        products: items,
        pagination: createPagination(page, limit, count, 'Products'),
      },
    });
  }

  @Get('category/:slug')
  async findByCategorySlug(
    @Res() res: Response,
    @Param('slug') slug: string,
    @Query() filterDto: FilterProductDto,
  ) {
    const result = await this.productsService.findByCategorySlug(
      slug,
      filterDto,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: `محصولات دسته‌بندی "${slug}" با موفقیت دریافت شدند`,
      data: result?.items,
    });
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.productsService.findOneBySlug(slug);

    return {
      statusCode: 200,
      message: 'محصول با موفقیت دریافت شد',
      data: product,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Put(':id/attributes')
  async addAttributes(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() dto: AddAttributesDto,
  ) {
    const data = await this.productAttributeService.addAttributesToProduct(
      id,
      dto.attributes,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'ویژگی‌ها با موفقیت اضافه شدند',
      data,
    });
  }

  @Put(':id/attributes/:attributeName')
  async updateAttributeValue(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('attributeName') attributeName: string,
    @Body() body: { value: string },
  ) {
    const data = await this.productAttributeService.updateAttributeValue(
      id,
      attributeName,
      body.value,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'مقدار ویژگی با موفقیت بروزرسانی شد',
      data,
    });
  }

  @Delete(':id/attributes/:attributeName')
  async removeAttribute(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('attributeName') attributeName: string,
  ) {
    await this.productAttributeService.removeAttributeFromProduct(
      id,
      attributeName,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'ویژگی با موفقیت از محصول حذف شد',
    });
  }

  @Delete(':id/attributes')
  async clearAttributes(@Res() res: Response, @Param('id') id: number) {
    await this.productAttributeService.clearProductAttributes(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'همه ویژگی‌های محصول با موفقیت حذف شدند',
    });
  }
}
