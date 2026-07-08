import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
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
  async create(createAddressDto: CreateAddressDto, userId: number) {
    const user = await this.usersService.findOne(userId);
    const newAddress = this.addressRepository.create({
      user,
      ...createAddressDto,
    });

    return await this.addressRepository.save(newAddress);
  }

  findAll() {
    return `This action returns all address`;
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
