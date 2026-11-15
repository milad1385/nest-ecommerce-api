import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from 'src/roles/roles.service';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const requiredPermission = this.reflector.getAllAndOverride<unknown[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) return true;

    const { user } = context.switchToHttp().getRequest();

    const permissions = await this.rolesService.getUserPermission(user.id);

    const hasPermission = requiredPermission.every((permission) =>
      permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('شما مجوزی برای دسترسی به این مسیر ندارید');
    }

    return true;
  }
}
