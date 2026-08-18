import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { SellersService } from 'src/sellers/sellers.service';
import { Repository } from 'typeorm';
import { CreateSellersRequestDto } from './dto/create-sellers-request.dto';
import { GetSellersRequestsDto } from './dto/get-seller-request.dto';
import { UpdateSellerRequestStatusDto } from './dto/update-seller-request-status.dto';
import { UpdateSellersRequestDto } from './dto/update-sellers-request.dto';
import { SellersRequest } from './entities/sellers-request.entity';
import { SellerRequestEnums } from './enums/sellers-requests-status-enums';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';

@Injectable()
export class SellersRequestsService {
  constructor(
    @InjectRepository(SellersRequest)
    private readonly sellerRequestRepository: Repository<SellersRequest>,
    private readonly sellerService: SellersService,
    private readonly productService: ProductsService,
  ) {}
  async create(
    createSellersRequestDto: CreateSellersRequestDto,
    userId: number,
  ) {
    const seller = await this.sellerService.findByUserId(userId);
    const { product_id, price, stock, priority, discount } =
      createSellersRequestDto;

    const sellerRequest = await this.sellerRequestRepository.findOne({
      where: {
        status: SellerRequestEnums.PENDING,
        seller: { id: seller.id },
        product: { id: product_id },
      },
    });

    if (sellerRequest) {
      throw new BadRequestException(
        'شما برای این محصول درخواست ثبت کرده اید لطفا منتظر نتیجه باشید',
      );
    }

    const isAcceptRequest = await this.sellerRequestRepository.findOne({
      where: {
        status: SellerRequestEnums.ACCEPT,
        seller: { id: seller.id },
        product: { id: product_id },
      },
    });

    if (isAcceptRequest) {
      throw new BadRequestException(
        'شما برای این محصول درخواست ثبت کرده اید و تایید شده است',
      );
    }

    const product = await this.productService.findOneById(product_id);

    const newSellerRequest = this.sellerRequestRepository.create({
      product,
      seller,
      price,
      discount,
      stock,
      priority,
    });

    return await this.sellerRequestRepository.save(newSellerRequest);
  }

  async findAll({
    page = 1,
    limit = 10,
    status,
  }: GetSellersRequestsDto): Promise<{
    sellersRequests: SellersRequest[];
    count: number;
  }> {
    let where: any = {};

    if (status) {
      where.status = status;
    }
    const count = await this.sellerRequestRepository.count({ where });
    const sellersRequests = await this.sellerRequestRepository.find({
      where,
      relations: {
        seller: {
          user: true,
        },
        product: {
          categories: {
            categories: {
              categories: true,
            },
          },
        },
      },
      select: {
        product: {
          title: true,
          categories: {
            title: true,
            slug: true,
            categories: {
              title: true,
              slug: true,
              categories: {
                title: true,
                slug: true,
              },
            },
          },
        },
        seller: {
          name: true,
          email: true,
          phone: true,
          province: true,
          user: {
            display_name: true,
            mobile: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { sellersRequests, count };
  }

  async findAllRequest(
    { page = 1, limit = 10, status }: GetSellersRequestsDto,
    userId: number,
  ): Promise<{
    sellerRequests: SellersRequest[];
    count: number;
  }> {
    let where: any = {
      seller: {
        user: {
          id: userId,
        },
      },
    };

    if (status) {
      where.status = status;
    }
    const count = await this.sellerRequestRepository.count({ where });
    const sellerRequests = await this.sellerRequestRepository.find({
      where,
      relations: {
        seller: {
          user: true,
        },
        product: {
          categories: {
            categories: {
              categories: true,
            },
          },
        },
      },
      select: {
        product: {
          title: true,
          categories: {
            title: true,
            slug: true,
            categories: {
              title: true,
              slug: true,
              categories: {
                title: true,
                slug: true,
              },
            },
          },
        },
        seller: {
          name: true,
          email: true,
          phone: true,
          province: true,
          user: {
            display_name: true,
            mobile: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { sellerRequests, count };
  }

  async findOneByUserId(id: number, userId: number, role: string) {
    const sellerRequest = await this.sellerRequestRepository.findOne({
      where: { id },
      relations: {
        seller: {
          user: true,
        },
        product: {
          categories: true,
        },
      },
      select: {
        seller: {
          id: true,
          name: true,
          phone: true,
          province: true,
          postal_code: true,
          user: {
            id: true,
            display_name: true,
            mobile: true,
          },
        },
      },
    });

    if (
      sellerRequest?.seller.user.id !== userId ||
      role !== UserRoleEnums.ADMIN
    ) {
      throw new ForbiddenException('شما مجوز دریافت این اطلاعات را ندارید');
    }

    if (!sellerRequest) {
      throw new NotFoundException(
        `درخواست فروشنده ای با این آیدی ${id} یافت نشد`,
      );
    }

    return sellerRequest;
  }

  async findOne(id: number) {
    const sellerRequest = await this.sellerRequestRepository.findOne({
      where: { id },
      relations: {
        seller: {
          user: true,
        },
        product: {
          categories: true,
        },
      },
      select: {
        seller: {
          id: true,
          name: true,
          phone: true,
          province: true,
          postal_code: true,
          user: {
            id: true,
            display_name: true,
            mobile: true,
          },
        },
      },
    });

    if (!sellerRequest) {
      throw new NotFoundException(
        `درخواست فروشنده ای با این آیدی ${id} یافت نشد`,
      );
    }

    return sellerRequest;
  }

  async update(id: number, updateSellersRequestDto: UpdateSellersRequestDto) {
    const sellerRequest = await this.findOne(id);
    const { stock, discount, price } = updateSellersRequestDto;

    if (stock) sellerRequest.stock = stock;

    if (discount) {
      sellerRequest.discount = discount;
      sellerRequest.status = SellerRequestEnums.PENDING;
      sellerRequest.adminComment = '';
    }

    if (price) {
      sellerRequest.price = price;
      sellerRequest.status = SellerRequestEnums.PENDING;
      sellerRequest.adminComment = '';
    }

    await this.sellerRequestRepository.save(sellerRequest);

    return await this.findOne(id);
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateSellerRequestStatusDto,
  ) {
    const { adminComment, status } = updateStatusDto;
    const sellerRequest = await this.findOne(id);

    sellerRequest.status = status;
    if (adminComment) {
      sellerRequest.adminComment = adminComment;
    }

    await this.sellerRequestRepository.save(sellerRequest);

    return await this.findOne(sellerRequest.id);
  }

  async remove(id: number) {
    const sellerRequest = await this.findOne(id);

    const deletedRequest = await this.sellerRequestRepository.delete(
      sellerRequest.id,
    );

    if (deletedRequest.affected === 0) {
      throw new BadRequestException(
        'هنگام حذف درخواست فروشنده مشکلی به وجود آمد',
      );
    }

    return sellerRequest;
  }

  async hasSellerThisProduct(
    seller_id: number | undefined,
    product_id: number,
  ): Promise<boolean> {
    if (!seller_id) return true;
    const sellerRequest = await this.sellerRequestRepository.findOne({
      where: {
        seller: {
          id: seller_id,
        },
        product: {
          id: product_id,
        },
        status: SellerRequestEnums.ACCEPT,
      },
    });

    if (!sellerRequest) {
      throw new BadRequestException('این فروشنده این محصول را ندارد');
    }

    return true;
  }
}
