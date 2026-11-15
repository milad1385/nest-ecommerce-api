import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';

@Public()
@ApiBearerAuth()
@ApiTags('احراز هویت')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async getMe(@Res() res: Response, @GetUser() user: User) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'اطلاعات شما با موفقیت دریافت شد',
      data: user,
    });
  }

  @Post('register')
  async register(@Res() res: Response, @Body() registerDto: RegisterDto) {
    const register = await this.authService.register(registerDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'ثبت نام با موفقیت انجام شد',
      data: register,
    });
  }

  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const login = await this.authService.login(loginDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'ورود با موفقیت انجام شد',
      data: login,
    });
  }
}
