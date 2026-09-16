import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { QueryBookmarkDto } from './dto/query-bookmark.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { createPagination } from 'utils/func';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('toggle')
  async toggle(
    @Res() res: Response,
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    const result = await this.bookmarksService.toggleBookmark(userId, dto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result
        ? 'محصول با موفقیت بوکمارک شد'
        : 'بوکمارک با موفقیت حذف شد',
      data: null,
    });
  }

  @Get()
  async list(
    @Res() res: Response,
    @GetUser('id') userId: number,
    @Query() query: QueryBookmarkDto,
  ) {
    const { page = 1, limit = 10 } = query;
    const { items, count } = await this.bookmarksService.getUserBookmarks(
      userId,
      query,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'لیست بوکمارک‌ها با موفقیت دریافت شد',
      data: {
        bookmarks: items,
        pagination: createPagination(page, limit, count, 'Bookmarks'),
      },
    });
  }

  @Get('check/:productId')
  async check(
    @Res() res: Response,
    @GetUser('id') userId: number,
    @Param('productId') productId: number,
  ) {
    const isBookmarked = await this.bookmarksService.isBookmarked(
      userId,
      +productId,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'وضعیت بوکمارک دریافت شد',
      data: { isBookmarked },
    });
  }

  @Patch(':productId/note')
  async updateNote(
    @Res() res: Response,
    @GetUser('id') userId: number,
    @Param('productId') productId: number,
    @Body('note') note: string,
  ) {
    const result = await this.bookmarksService.updateNote(
      +userId,
      +productId,
      note,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'یادداشت بوکمارک با موفقیت بروزرسانی شد',
      data: result,
    });
  }

  @Get('product/:productId/count')
  async productCount(
    @Res() res: Response,
    @Param('productId') productId: number,
  ) {
    const count =
      await this.bookmarksService.getProductBookmarkCount(+productId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'تعداد بوکمارک‌های محصول دریافت شد',
      data: { productId, bookmarkCount: count },
    });
  }
}
