import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import type { Response } from 'express';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BasketsService } from './baskets.service';
import { AddToBasketDto } from './dto/add-to-basket.dto';
import { UpdateQuantityDto } from './dto/update-basket.dto';

@Controller('baskets')
@UseGuards(JwtAuthGuard)
export class BasketsController {
  constructor(private readonly basketsService: BasketsService) {}

  @Post()
  async add(
    @Res() res: Response,
    @Body() dto: AddToBasketDto,
    @GetUser('id') userId: number,
  ) {
    const result = await this.basketsService.addToBasket(userId, dto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'محصول به سبد خرید اضافه شد',
      data: result.data,
    });
  }

  @Get()
  async getBasket(@Res() res: Response, @GetUser('id') userId: number) {
    const result = await this.basketsService.getUserBasket(userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: result.data,
    });
  }

  @Get('count')
  async getCount(@Res() res: Response, @GetUser('id') userId: number) {
    const result = await this.basketsService.getBasketCount(userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: result.data,
    });
  }

  @Patch(':id/quantity')
  async updateQuantity(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() dto: UpdateQuantityDto,
    @GetUser('id') userId: number,
  ) {
    const result = await this.basketsService.updateQuantity(userId, +id, dto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'تعداد با موفقیت بروزرسانی شد',
      data: result.data,
    });
  }

  @Delete(':id')
  async removeItem(
    @Res() res: Response,
    @Param('id') id: number,
    @GetUser('id') userId: number,
  ) {
    const result = await this.basketsService.removeItem(userId, +id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'آیتم از سبد خرید حذف شد',
      data: result.data,
    });
  }

  @Delete()
  async clearBasket(@Res() res: Response, @GetUser('id') userId: number) {
    const result = await this.basketsService.clearBasket(userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: result.data,
    });
  }
}
