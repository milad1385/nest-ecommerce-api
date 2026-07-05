import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(
    registerDto: RegisterDto,
  ): Promise<{ accessToken: string; user: User }> {
    try {
      const user = await this.userService.create(registerDto);
      const payload = {
        sub: user.id,
        mobile: user.mobile,
        display_name: user.display_name,
      };
      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: User }> {
    try {
      const user = await this.userService.findOneByMobileNumber(
        loginDto.mobile,
      );
      if (!user) {
        throw new NotFoundException(
          'کاربری با این شماره تلفن یا پسورد یافت نشد.',
        );
      }

      const isValidPassword = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isValidPassword) {
        throw new NotFoundException(
          'کاربری با این شماره تلفن یا پسورد یافت نشد.',
        );
      }
      const payload = {
        sub: user?.id,
        mobile: user?.mobile,
        display_name: user?.display_name,
      };
      const accessToken = this.jwtService.sign(payload);
      return {
        accessToken,
        user,
      };
    } catch (error) {
      throw error;
    }
  }
}
