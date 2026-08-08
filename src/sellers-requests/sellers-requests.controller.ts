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
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';
import { CreateSellersRequestDto } from './dto/create-sellers-request.dto';
import { UpdateSellerRequestStatusDto } from './dto/update-seller-request-status.dto';
import { UpdateSellersRequestDto } from './dto/update-sellers-request.dto';
import { SellersRequestsService } from './sellers-requests.service';
import { GetSellersRequestsDto } from './dto/get-seller-request.dto';
import { createPagination } from 'utils/func';

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  @Get()
  async findAll(
    @Res() res: Response,
    @Query() queryDto: GetSellersRequestsDto,
  ) {
    const { page, limit } = queryDto;
    const { sellersRequests, count } =
      await this.sellersRequestsService.findAll(queryDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'لیست درخواست فروشندگان با موفقیت دریافت شد',
      data: {
        sellersRequests,
        pagination: createPagination(page, limit, count, 'SellersRequests'),
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.SELLER, UserRoleEnums.ADMIN)
  @Get('/own')
  async findAllRequest(
    @Res() res: Response,
    @Query() queryDto: GetSellersRequestsDto,
    @GetUser('id') userId: number,
  ) {
    const { page, limit } = queryDto;
    const { sellerRequests, count } =
      await this.sellersRequestsService.findAllRequest(queryDto, userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'لیست درخواست شما با موفقیت دریافت شد',
      data: {
        sellerRequests,
        pagination: createPagination(page, limit, count, 'SellerRequests'),
      },
    });
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.SELLER, UserRoleEnums.ADMIN)
  @Get(':id')
  async findOne(
    @Res() res: Response,
    @Param('id') id: string,
    @GetUser('id') userId: number,
    @GetUser('role') role: string,
  ) {
    const sellerRequest = await this.sellersRequestsService.findOneByUserId(
      +id,
      userId,
      role,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'درخواست فروشنده با موفقیت دریافت شد',
      data: sellerRequest,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.SELLER)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    const deletedSellerRequest = await this.sellersRequestsService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'درخواست فروشنده با موفقیت حذف شد',
      data: deletedSellerRequest,
    });
  }
}
