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
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Permission } from './decorators/permission.decorator';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Res() res: Response, @GetUser() user: User) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'اطلاعات شما با موفقیت دریافت شد',
      data: user,
    });
  }

  @Public()
  @Post('register')
  async register(@Res() res: Response, @Body() registerDto: RegisterDto) {
    const register = await this.authService.register(registerDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'ثبت نام با موفقیت انجام شد',
      data: register,
    });
  }

  @Public()
  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const login = await this.authService.login(loginDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'ورود با موفقیت انجام شد',
      data: login,
    });
  }

  @ApiOperation({summary:"این مسیر برای دریافت مجوز های یک کاربر خاص می باشد"})
  @Permission('user.read')
  @Get('permissions/user/:id')
  async getUserPermission(@Res() res: Response, @Param('id') userId: number) {
    const roles = await this.authService.getUserPermission(userId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'با موفقیت دریافت شد',
      data: roles,
    });
  }
}
