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
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, GetUserDto, GetUserIdDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Response } from 'express';
import { createPagination } from 'utils/func';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'کاربر با موفقیت ساخته شد',
      data: user,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Query() queryDto: GetUserDto) {
    const { page, limit } = queryDto;
    const { users, count } = await this.usersService.findAll(queryDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کاربران با موفقیت دریافت شد',
      data: {
        users,
        pagination: createPagination(page, limit, count, 'Users'),
      },
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param() params: GetUserIdDto) {
    const { id } = params;
    const user = await this.usersService.findOne(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کاربر با موفقیت دریافت شد',
      data: user,
    });
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param() params: GetUserIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = params;
    const updatedUser = await this.usersService.update(id, updateUserDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کاربر با موفقیت آپدیت شد',
      data: updatedUser,
    });
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param() params: GetUserIdDto) {
    const { id } = params;
    const deletedUser = await this.usersService.remove(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'کاربر با موفقیت حذف شد',
      data: deletedUser,
    });
  }
}
