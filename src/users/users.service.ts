import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, GetUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRoleEnums } from './enums/userRoleEnums';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const isUserExist = await this.findOneByMobile(
        createUserDto.mobile,
        createUserDto.email,
        createUserDto.username,
      );
      if (isUserExist) {
        throw new BadRequestException(
          'کاربری با این اطلاعات در سایت وجود دارد ',
        );
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const role =
        (await this.userRepository.count({})) === 0
          ? UserRoleEnums.ADMIN
          : UserRoleEnums.USER;
      const newUser = this.userRepository.create({
        ...createUserDto,
        role,
        password: hashedPassword,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    status,
  }: GetUserDto): Promise<{ users: User[]; count: number }> {
    try {
      let where: any = {};
      if (status) {
        where.status = status;
      }
      const count = await this.userRepository.count({});
      const users = await this.userRepository.find({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        users,
        count,
      };
    } catch (error) {
      throw new BadRequestException('هنگام دریافت کاربران مشکلی به وجود آمد');
    }
  }

  async findOneByMobile(mobile: string, email?: string, username?: string) {
    const user = await this.userRepository.findOne({
      where: [{ mobile }, { email }, { username }],
    });
    return user;
  }

  async findOneByMobileNumber(mobile: string) {
    const user = await this.userRepository.findOne({
      where: { mobile },
    });
    return user;
  }
  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException(`کاربر با آیدی ${id} یافت نشد`);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
  async getUserAddress(userId): Promise<User | null> {
    const user = await this.findOne(userId);
    const userAddresses = await this.userRepository.findOne({
      where: { id: user.id },
      relations: {
        addresses: true,
      },
    });

    return userAddresses;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(id);
      const { display_name, role } = updateUserDto;
      const updatedUser = await this.userRepository.update(id, {
        display_name,
        role,
      });
      if (updatedUser.affected === 0) {
        throw new BadRequestException('هنگام آپدیت تسک مشکلی به وجود آمد');
      }

      return await this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    const deletedUser = await this.userRepository.delete(id);

    if (deletedUser.affected === 0) {
      throw new BadRequestException('هنگام حذف کاربر مشکلی پیش آمد');
    }

    return user;
  }
}
