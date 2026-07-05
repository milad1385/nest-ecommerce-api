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
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Res() res: Response, @Body() registerDto: RegisterDto) {
    const register = await this.authService.register(registerDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'ثبت نام با موفقیت انجام شد',
      data: register,
    });
  }

  @Post("login")
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const login = await this.authService.login(loginDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'ورود با موفقیت انجام شد',
      data: login,
    });
  }
}
