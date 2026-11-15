import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role , Permission]), UsersModule],
  controllers: [RolesController],
  providers: [RolesService, { provide: APP_GUARD, useClass: PermissionGuard }],
})
export class RolesModule {}
