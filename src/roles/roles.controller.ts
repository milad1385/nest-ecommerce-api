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

@ApiBearerAuth()
@ApiTags('نقش و دسترسی ها')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Res() res: Response, @Body() createRoleDto: CreateRoleDto) {
    const newRole = await this.rolesService.create(createRoleDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'نقش با موفقیت ساخته شد',
      data: newRole,
    });
  }

  @Post('/append-to-user')
  async addRoleToUser(@Res() res: Response, @Body() addRole: AddRoleToUser) {
    const newRole = await this.rolesService.addRoleToUser(addRole);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'نقش با موفقیت به کاربر داده شد',
      data: newRole,
    });
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
