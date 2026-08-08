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
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';
import { CreateSellersRequestDto } from './dto/create-sellers-request.dto';
import { UpdateSellerRequestStatusDto } from './dto/update-seller-request-status.dto';
import { UpdateSellersRequestDto } from './dto/update-sellers-request.dto';
import { SellersRequestsService } from './sellers-requests.service';

@Controller('sellers-requests')
export class SellersRequestsController {
  constructor(
    private readonly sellersRequestsService: SellersRequestsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.SELLER, UserRoleEnums.ADMIN)
  @Post()
  async create(
    @Res() res: Response,
    @Body() createSellersRequestDto: CreateSellersRequestDto,
    @GetUser('id') userId: number,
  ) {
    const sellerReqeust = await this.sellersRequestsService.create(
      createSellersRequestDto,
      userId,
    );

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'درخواست فروشنده با موفقیت ثبت شد',
      data: sellerReqeust,
    });
  }

  @Get()
  findAll() {
    return this.sellersRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellersRequestsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateSellersRequestDto: UpdateSellersRequestDto,
  ) {
    const updatedSellerRequest = await this.sellersRequestsService.update(
      +id,
      updateSellersRequestDto,
    );

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'درخواست فروشنده آپدیت شد',
      data: updatedSellerRequest,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateSellerRequestStatusDto: UpdateSellerRequestStatusDto,
  ) {
    const sellerRequest = await this.sellersRequestsService.updateStatus(
      +id,
      updateSellerRequestStatusDto,
    );

    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'وضعیت درخواست فروشنده تغییر کرد',
      data: sellerRequest,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellersRequestsService.remove(+id);
  }
}
