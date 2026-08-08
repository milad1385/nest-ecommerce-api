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
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { GetSellerDto } from './dto/get-seller.dto';
import { createPagination } from 'utils/func';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateSellerStatusDto } from './dto/update-seller-status.dto';

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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateSellerDto: UpdateSellerDto,
    @GetUser('id') userId: number,
  ) {
    const seller = await this.sellersService.update(
      +id,
      updateSellerDto,
      userId,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'فروشنده با موفقیت آپدیت شد',
      data: seller,
    });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoleEnums.ADMIN)
  async updateStatus(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateSellerStatusDto,
  ) {
    const seller = await this.sellersService.updateStatus(+id, updateStatusDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'وضعیت فروشنده با موفقیت تغییر یافت',
      data: seller,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  async remove(@Res() res: Response, @Param('id') id: string) {
    const seller = await this.sellersService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'فروشنده با موفقیت حذف شد',
      data: seller,
    });
  }
}
