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
import { Repository } from 'typeorm';
import { AddRoleToUser } from './dto/addRoleToUser.dto';
import { DeleteRoleFromUser } from './dto/deleteRoleFromUser.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly userService: UsersService,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
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

  async findAll() {
    const roles = await this.roleRepository.find({
      relations: {
        permissions: true,
      },
    });

    return roles;
  }

  async findOne(id: number): Promise<Role> {
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

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
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
}
