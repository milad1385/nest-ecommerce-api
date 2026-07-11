import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto, GetAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly usersService: UsersService,
  ) {}
  async create(
    createAddressDto: CreateAddressDto,
    userId: number,
  ): Promise<Address> {
    const user = await this.usersService.findOne(userId);
    const newAddress = this.addressRepository.create({
      user,
      ...createAddressDto,
    });

    return await this.addressRepository.save(newAddress);
  }

  async findAll({
    page = 1,
    limit = 10,
  }: GetAddressDto): Promise<{ addresses: Address[]; count: number }> {
    const count = await this.addressRepository.count({});
    const addresses = await this.addressRepository.find({
      select: {
        user: {
          display_name: true,
          username: true,
          mobile: true,
          email: true,
          createdAt: true,
        },
      },
      relations: {
        user: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { addresses, count };
  }

  async findOne(id: number) {
    const address = await this.addressRepository.findOne({
      where: { id },
      select: {
        user: {
          display_name: true,
          username: true,
          mobile: true,
          email: true,
          createdAt: true,
        },
      },
      relations: {
        user: true,
      },
    });
    if (!address) {
      throw new NotFoundException('آدرسی با این آیدی یافت نشد');
    }
    return address;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  async remove(id: number) {
    const address = await this.findOne(id);
    const deletedAddress = await this.addressRepository.delete(id);
    if (deletedAddress.affected === 0) {
      throw new BadRequestException('در هنگام حذف آدرس مشکلی ایجاد شد');
    }
    return address;
  }
}
