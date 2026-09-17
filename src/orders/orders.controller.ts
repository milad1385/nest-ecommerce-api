import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { createPagination } from 'utils/func';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 🛒 ایجاد سفارش از سبد
  @Post()
  async create(
    @Res() res: Response,
    @Body() dto: CreateOrderDto,
    @GetUser('id') userId: number,
  ) {
    const order = await this.ordersService.createFromBasket(userId, dto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'سفارش با موفقیت ثبت شد',
      data: order,
    });
  }

  @Get('my')
  async findMyOrders(
    @Res() res: Response,
    @Query() query: QueryOrderDto,
    @GetUser('id') userId: number,
  ) {
    const { page = 1, limit = 10 } = query;
    const { items, count } = await this.ordersService.findMyOrders(
      userId,
      query,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'لیست سفارش‌های شما دریافت شد',
      data: {
        orders: items,
        pagination: createPagination(page, limit, count, 'Orders'),
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  @Get()
  async findAll(@Res() res: Response, @Query() query: QueryOrderDto) {
    const { page = 1, limit = 10 } = query;
    const { items, count } = await this.ordersService.findAll(query);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'لیست سفارش‌ها دریافت شد',
      data: {
        orders: items,
        pagination: createPagination(page, limit, count, 'Orders'),
      },
    });
  }

  // 📦 جزئیات سفارش
  @Get(':id')
  async findOne(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    const order = await this.ordersService.findOne(id, userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'جزئیات سفارش دریافت شد',
      data: order,
    });
  }

  // 🔄 تغییر وضعیت (ادمین)
  @Patch(':id/status')
  async updateStatus(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const order = await this.ordersService.updateStatus(id, dto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'وضعیت سفارش بروزرسانی شد',
      data: order,
    });
  }

  // ❌ لغو سفارش (کاربر)
  @Patch(':id/cancel')
  async cancelOrder(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelOrderDto,
    @GetUser('id') userId: number,
  ) {
    const order = await this.ordersService.cancelOrder(userId, id, dto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'سفارش با موفقیت لغو شد',
      data: order,
    });
  }
}
