import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { AddRoleToUser } from './dto/addRoleToUser.dto';
import { DeleteRoleFromUser } from './dto/deleteRoleFromUser.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './entities/permission.entity';
import { AddPermissionToRole } from './dto/addPermissionToRole.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly userService: UsersService,
  ) {}
  async createRole(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;
    const role = await this.roleRepository.findOne({ where: { name } });

    if (role) {
      throw new BadRequestException('این نقش از قبل وجود دارد');
    }

    const newRole = this.roleRepository.create({ name });

    return await this.roleRepository.save(newRole);
  }

  async addRoleToUser(addRole: AddRoleToUser) {
    const { role_id, user_id } = addRole;
    const user = await this.userService.findUserPermissionById(user_id);

    const role = await this.roleRepository.findOne({ where: { id: role_id } });

    if (!role) {
      throw new NotFoundException('نقشی با این آیدی یافت نشد');
    }

    const hasRole = user.roles.find((role) => role.id === role_id);
    if (!hasRole) {
      return await this.userService.addRoleToUser(user_id, role);
    }

    throw new BadRequestException('این کاربر از قبل دارای این نقش است');
  }

  async deleteRoleFromUser(deleteRole: DeleteRoleFromUser) {
    const { role_id, user_id } = deleteRole;
    const user = await this.userService.findUserPermissionById(user_id);

    const role = await this.roleRepository.findOne({ where: { id: role_id } });

    if (!role) {
      throw new NotFoundException('نقشی با این آیدی یافت نشد');
    }

    const hasRole = user.roles.find((role) => role.id === role_id);
    if (hasRole) {
      return await this.userService.deleteRoleFromUser(user_id, role_id);
    }

    throw new BadRequestException('نقش مورد نظر نا معتبر است');
  }

  async findAllRoles() {
    const roles = await this.roleRepository.find({
      relations: {
        permissions: true,
      },
    });

    return roles;
  }

  async findOneRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
      relations: {
        permissions: true,
      },
    });

    if (!role) {
      throw new NotFoundException('نقشی با این آیدی یافت نشد');
    }

    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const { name } = updateRoleDto;
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('نقشی با این آیدی یافت نشد');
    }
    if (name) {
      role.name = name;
    }

    return await this.roleRepository.save(role);
  }

  async getUserPermission(userId: number) {
    const user = await this.userService.findUserPermissionById(userId);

    const permissions = new Set();

    user.roles.forEach((role) =>
      role.permissions.forEach((permission) =>
        permissions.add(permission.name),
      ),
    );

    user.permissions.forEach((permission) => permissions.add(permission.name));

    return Array.from(permissions);
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const names = Array.isArray(createPermissionDto.name)
      ? createPermissionDto.name
      : [createPermissionDto.name];

    const existing = await this.permissionRepository.find({
      where: names.map((n) => ({ name: n })),
      select: {
        name: true,
      },
    });
    const existingNames = new Set(existing.map((e) => e.name));
    const newNames = names.filter((n) => !existingNames.has(n));

    if (newNames.length === 0)
      throw new BadRequestException('نقش با این نام وجود دارد');

    await this.permissionRepository.insert(newNames.map((n) => ({ name: n })));

    return this.permissionRepository.find({
      where: newNames.map((n) => ({ name: n })),
    });
  }

  async addPermissionToRole(dto: AddPermissionToRole) {
    const { role_id, permission_ids } = dto;

    const role = await this.roleRepository.findOne({
      where: { id: role_id },
      relations: { permissions: true },
    });

    if (!role) {
      throw new NotFoundException('نقشی با این آیدی یافت نشد');
    }

    const permissions = await this.permissionRepository.find({
      where: { id: In(permission_ids) },
    });

    if (permissions.length !== permission_ids.length) {
      throw new NotFoundException('بعضی از مجوزها یافت نشدند');
    }

    const existingIds = new Set(role.permissions.map((p) => p.id));
    const newPermissions = permissions.filter((p) => !existingIds.has(p.id));

    if (newPermissions.length === 0) {
      throw new BadRequestException(
        'همه‌ی این مجوزها از قبل به نقش داده شده‌اند',
      );
    }

    role.permissions = [...role.permissions, ...newPermissions];
    return await this.roleRepository.save(role);
  }
}
