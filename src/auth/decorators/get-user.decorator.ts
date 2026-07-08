import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new UnauthorizedException('لطفاً وارد سیستم شوید');
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
