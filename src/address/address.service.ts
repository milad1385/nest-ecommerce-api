import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
