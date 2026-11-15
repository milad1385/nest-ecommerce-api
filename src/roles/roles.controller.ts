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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/auth/decorators/permission.decorator';
import type { Response } from 'express';
import { AddRoleToUser } from './dto/addRoleToUser.dto';
import { DeleteRoleFromUser } from './dto/deleteRoleFromUser.dto';

@ApiBearerAuth()
@ApiTags('نقش و دسترسی ها')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'برای ساخت نقش جدید است' })
  @Post()
  async create(@Res() res: Response, @Body() createRoleDto: CreateRoleDto) {
    const newRole = await this.rolesService.create(createRoleDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'نقش با موفقیت ساخته شد',
      data: newRole,
    });
  }

  @ApiOperation({ summary: 'برای اضافه کردن نقش به کاربر است' })
  @Post('append-to-user')
  async addRoleToUser(@Res() res: Response, @Body() addRole: AddRoleToUser) {
    const role = await this.rolesService.addRoleToUser(addRole);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'نقش با موفقیت به کاربر داده شد',
      data: role,
    });
  }

  @ApiOperation({ summary: 'برای دریافت تمام نقش ها می باشد' })
  @Get()
  async findAll(@Res() res: Response) {
    const roles = await this.rolesService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'نقش ها با موفقیت دریافت شد',
      data: roles,
    });
  }

  @ApiOperation({ summary: 'برای دریافت نقش خاصی استفاده می شود' })
  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: number) {
    const role = await this.rolesService.findOne(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'نقش دریافت شد',
      data: role,
    });
  }

  @ApiOperation({ summary: 'برای دریافت مجوز های یک کاربر خاص می باشد' })
  @Permission('user.read')
  @Get('permissions/user/:id')
  async getUserPermission(@Res() res: Response, @Param('id') userId: number) {
    const roles = await this.rolesService.getUserPermission(userId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'با موفقیت دریافت شد',
      data: roles,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: 'برای حذف نقش از کاربر است' })
  @Delete('delete-from-user')
  async deleteRoleFromUser(
    @Res() res: Response,
    @Body() deleteRole: DeleteRoleFromUser,
  ) {
    const role = await this.rolesService.deleteRoleFromUser(deleteRole);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'نقش با موفقیت از کاربر حذف شد',
      data: role,
    });
  }
}
