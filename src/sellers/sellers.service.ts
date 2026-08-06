import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { GetSellerDto } from './dto/get-seller.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateSellerStatusDto } from './dto/update-seller-status.dto';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    private readonly usersService: UsersService,
  ) {}
  async create(createSellerDto: CreateSellerDto) {
    const user = await this.usersService.findOne(createSellerDto.userId);

    const seller = await this.sellerRepository.findOne({
      where: {
        user: {
          id: createSellerDto.userId,
        },
      },
    });

    if (seller) {
      throw new BadRequestException(
        'فروشنده ای با این اطلاعات کاربری وجود دارد',
      );
    }

    const emailExists = await this.sellerRepository.findOne({
      where: { email: createSellerDto.email },
    });

    if (emailExists) {
      throw new BadRequestException(
        'این ایمیل قبلاً توسط فروشنده دیگری ثبت شده است',
      );
    }

    const phoneExists = await this.sellerRepository.findOne({
      where: { phone: createSellerDto.phone },
    });

    if (phoneExists) {
      throw new BadRequestException(
        'این شماره تلفن قبلاً توسط فروشنده دیگری ثبت شده است',
      );
    }

    const newSeller = this.sellerRepository.create({
      ...createSellerDto,
      user,
    });

    return await this.sellerRepository.save(newSeller);
  }

  async findAll({
    page = 1,
    limit = 10,
    status,
  }: GetSellerDto): Promise<{ sellers: Seller[]; count: number }> {
    let where: any = {};
    if (status) {
      where.status = status;
    }
    const count = await this.sellerRepository.count({});
    const sellers = await this.sellerRepository.find({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          display_name: true,
          email: true,
          mobile: true,
          createdAt: true,
        },
      },
    });

    return {
      sellers,
      count,
    };
  }

  async findOne(id: number) {
    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: { user: true },
      select: {
        user: {
          id: true,
          display_name: true,
          email: true,
          mobile: true,
          username: true,
          createdAt: true,
        },
      },
    });

    if (!seller) {
      throw new NotFoundException(`فروشنده ای با این آیدی ${id} یافت نشد`);
    }

    return seller;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto, userId: number) {
    const { province, email, name, phone, postal_code } = updateSellerDto;
    const seller = await this.findOne(id);

    if (userId !== seller.user.id) {
      throw new ForbiddenException(
        'فقط خود فروشنده می تواند اطلاعات را ویرایش کند',
      );
    }
    if (name) seller.name = name;
    if (phone) seller.phone = phone;
    if (email) seller.email = email;
    if (postal_code) seller.postal_code = postal_code;
    if (province) seller.province = province;

    await this.sellerRepository.save(seller);

    return await this.findOne(id);
  }

  async updateStatus(id: number, updateStatusDto: UpdateSellerStatusDto) {
    const seller = await this.findOne(id);

    seller.status = updateStatusDto.status;

    const updatedSeller = await this.sellerRepository.save(seller);

    return await this.sellerRepository.findOne({
      where: { id: updatedSeller.id },
      relations: { user: true },
      select: {
        user: {
          username: true,
          display_name: true,
          email: true,
        },
      },
    });
  }

  async remove(id: number) {
    const seller = await this.findOne(id);
    console.log(seller);

    const deletedSeller = await this.sellerRepository.delete(id);
    if (deletedSeller.affected === 0) {
      throw new BadRequestException('هنگام حذف فروشنده مشکلی به وجود آمد');
    }

    return seller;
  }
}
