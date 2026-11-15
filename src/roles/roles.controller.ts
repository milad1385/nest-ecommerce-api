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
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AddPermissionToRole } from './dto/addPermissionToRole.dto';

@ApiBearerAuth()
@ApiTags('نقش و دسترسی ها')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'برای ساخت نقش جدید است' })
  @Post()
  async createRole(@Res() res: Response, @Body() createRoleDto: CreateRoleDto) {
    const newRole = await this.rolesService.createRole(createRoleDto);

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
  async findAllRoles(@Res() res: Response) {
    const roles = await this.rolesService.findAllRoles();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'نقش ها با موفقیت دریافت شد',
      data: roles,
    });
  }

  @ApiOperation({ summary: 'برای دریافت نقش خاصی استفاده می شود' })
  @Get(':id')
  async findOneRole(@Res() res: Response, @Param('id') id: number) {
    const role = await this.rolesService.findOneRole(id);

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

  @ApiOperation({ summary: 'برای آپدیت نقش استفاده می شود' })
  @Patch(':id')
  async updateRole(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const newRole = await this.rolesService.updateRole(+id, updateRoleDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'نقش با موفقیت آپدیت شد',
      data: newRole,
    });
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

  @ApiOperation({ summary: 'برای ساخت مجوز استفاده می شود' })
  @Post('permission')
  async createPermission(
    @Res() res: Response,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    const newPermission =
      await this.rolesService.createPermission(createPermissionDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'مجوز با موفقیت ساخته شد',
      data: newPermission,
    });
  }

  @ApiOperation({ summary: 'برای اضافه کردن مجوز ها به نقش است' })
  @Post('permission/append-to-role')
  async addPermissionToRole(
    @Res() res: Response,
    @Body() addPermissionToRole: AddPermissionToRole,
  ) {
    const role =
      await this.rolesService.addPermissionToRole(addPermissionToRole);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'مجوز با موفقیت به نقش  اضافه شد',
      data: role,
    });
  }
}
