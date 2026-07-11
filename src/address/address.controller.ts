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
import { AddressService } from './address.service';
import {
  CreateAddressDto,
  GetAddressDto,
  GetAddressIdDto,
} from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { createPagination } from 'utils/func';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Res() res: Response,
    @GetUser('id') userId: number,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    const address = await this.addressService.create(createAddressDto, userId);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'آدرس با موفقیت ساخته شد',
      data: address,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Res() res: Response,
    @GetUser('id') userId: number,
    @Query() params: GetAddressDto,
  ) {
    const { page, limit } = params;
    const { addresses, count } = await this.addressService.findAll(params);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'آدرس های کاربران با موفقیت دریافت شد.',
      data: {
        addresses,
        pagination: createPagination(page, limit, count, 'Addresses'),
      },
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param() { id }: GetAddressIdDto) {
    const address = await this.addressService.findOne(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'آدرس با موفقیت دریافت شد.',
      data:address
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
