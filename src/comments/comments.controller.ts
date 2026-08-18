import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilterCommentDto } from './dto/filter-comment.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';
import { createPagination } from 'utils/func';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Res() res: Response,
    @GetUser('id') userId: number,
    @Body() dto: CreateCommentDto,
  ) {
    const data = await this.commentsService.create(userId, dto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'کامنت با موفقیت ثبت شد و در انتظار تایید است',
      data,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Query() filterDto: FilterCommentDto) {
    const { page = 1, limit = 10 } = filterDto;
    const { items, count } = await this.commentsService.findAll(filterDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'لیست کامنت ها با موفقیت دریافت شد',
      data: items,
      pagination: createPagination(page, limit, count, 'Comments'),
    });
  }

  @Get('product/:productId')
  async findByProduct(
    @Res() res: Response,
    @Param('productId') productId: number,
  ) {
    const data = await this.commentsService.findByProduct(productId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کامنت‌های محصول با موفقیت دریافت شد',
      data,
    });
  }

  @Get('seller/:sellerId')
  async findBySeller(
    @Res() res: Response,
    @Param('sellerId') sellerId: number,
  ) {
    const data = await this.commentsService.findBySeller(sellerId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کامنت‌های فروشنده',
      data,
    });
  }

  @Get('product/:productId/stats')
  async getProductStats(
    @Res() res: Response,
    @Param('productId') productId: number,
  ) {
    const data = await this.commentsService.getProductStats(productId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'آمار کامنت‌های محصول',
      data,
    });
  }

  @Get('seller/:sellerId/stats')
  async getSellerStats(
    @Res() res: Response,
    @Param('sellerId') sellerId: number,
  ) {
    const data = await this.commentsService.getSellerStats(sellerId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'آمار کامنت‌های فروشنده',
      data,
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: number) {
    const data = await this.commentsService.findOne(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کامنت پیدا شد',
      data,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Res() res: Response,
    @Param('id') id: number,
    @GetUser('id') userId: number,
    @Body() dto: UpdateCommentDto,
  ) {
    const data = await this.commentsService.update(id, userId, dto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کامنت با موفقیت بروزرسانی شد',
      data,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Res() res: Response,
    @Param('id') id: number,
    @GetUser('id') userId: number,
  ) {
    await this.commentsService.remove(id, userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کامنت با موفقیت حذف شد',
    });
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  async approve(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() body: { adminReply?: string },
  ) {
    const data = await this.commentsService.approve(id, body.adminReply);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کامنت با موفقیت تایید شد',
      data,
    });
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  async reject(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() body: { adminReply?: string },
  ) {
    const data = await this.commentsService.reject(id, body.adminReply);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کامنت با موفقیت رد شد',
      data,
    });
  }

  @Put(':id/admin-reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  async adminReply(
    @Res() res: Response,
    @Param('id') id: number,
    @Body() body: { adminReply: string },
  ) {
    const data = await this.commentsService.adminReply(id, body.adminReply);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'پاسخ ادمین با موفقیت ثبت شد',
      data,
    });
  }
}
