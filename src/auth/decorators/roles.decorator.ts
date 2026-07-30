import { SetMetadata } from '@nestjs/common';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoleEnums[]) => SetMetadata(ROLES_KEY, roles);
