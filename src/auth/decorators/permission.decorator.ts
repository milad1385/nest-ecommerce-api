import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissions';
export const Permission = (...params: string[]) =>
  SetMetadata(PERMISSION_KEY, params);
