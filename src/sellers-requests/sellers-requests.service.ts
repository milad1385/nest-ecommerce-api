import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSellersRequestDto } from './dto/create-sellers-request.dto';
import { UpdateSellersRequestDto } from './dto/update-sellers-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SellersRequest } from './entities/sellers-request.entity';
import { Repository } from 'typeorm';
import { SellersService } from 'src/sellers/sellers.service';
import { SellerRequestEnums } from './enums/sellers-requests-status-enums';
import { ProudctsService } from 'src/proudcts/proudcts.service';
import { UpdateSellerRequestStatusDto } from './dto/update-seller-request-status.dto';

@Injectable()
export class SellersRequestsService {
  constructor(
    @InjectRepository(SellersRequest)
    private readonly sellerRequestRepository: Repository<SellersRequest>,
    private readonly sellerService: SellersService,
    private readonly productService: ProudctsService,
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

  findAll() {
    return `This action returns all sellersRequests`;
  }

  async findOne(id: number) {
    const sellerRequest = await this.sellerRequestRepository.findOne({
      where: { id },
      relations: {
        seller: true,
        product: true,
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
}
