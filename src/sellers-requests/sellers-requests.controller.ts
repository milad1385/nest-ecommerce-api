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
} from '@nestjs/common';
import { SellersRequestsService } from './sellers-requests.service';
import { CreateSellersRequestDto } from './dto/create-sellers-request.dto';
import { UpdateSellersRequestDto } from './dto/update-sellers-request.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSellersRequestDto: UpdateSellersRequestDto,
  ) {
    return this.sellersRequestsService.update(+id, updateSellersRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellersRequestsService.remove(+id);
  }
}
