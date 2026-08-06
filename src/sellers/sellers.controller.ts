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
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { GetSellerDto } from './dto/get-seller.dto';
import { createPagination } from 'utils/func';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Res() res: Response,
    @Body() createSellerDto: CreateSellerDto,
    @GetUser('id') userId: number,
  ) {
    const seller = await this.sellersService.create({
      ...createSellerDto,
      userId,
    });
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'فروشنده با موفقیت ساخته شد',
      data: seller,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Query() sellerDto: GetSellerDto) {
    const { page, limit } = sellerDto;
    const { sellers, count } = await this.sellersService.findAll(sellerDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'فروشندگان با موفقیت دریافت شد',
      data: {
        sellers,
        pagination: createPagination(page, limit, count, 'Sellers'),
      },
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const seller = await this.sellersService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'فروشنده با موفقیت دریافت شد',
      data: seller,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellersService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellersService.remove(+id);
  }
}
