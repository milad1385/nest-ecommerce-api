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
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-proudct.dto';
import { UpdateProductDto } from './dto/update-proudct.dto';
import type { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';
import { FilterProductDto } from './dto/filter-product.dto';
import { createPagination } from 'utils/func';
import { ProductAttributeService } from './product-attribute.service';
import { AddAttributesDto } from './dto/add-attributes.dto';

@Controller('Products')
export class ProductsController {
  constructor(
    private readonly ProductsService: ProductsService,
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  async create(
    @Res() res: Response,
    @Body() createProductDto: CreateProductDto,
  ) {
    const product = await this.ProductsService.create(createProductDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'محصول با موفقیت ساخته شد',
      data: product,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Query() filterDto: FilterProductDto) {
    const { page, limit } = filterDto;
    const { items, count } = await this.ProductsService.findAll(filterDto);

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
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
    const result = await this.ProductsService.findByCategorySlug(
      slug,
      filterDto,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: `محصولات دسته‌بندی "${slug}" با موفقیت دریافت شدند`,
      data: result.items,
    });
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.ProductsService.findOneBySlug(slug);

    return {
      statusCode: 200,
      message: 'محصول با موفقیت دریافت شد',
      data: product,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.ProductsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ProductsService.remove(+id);
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
