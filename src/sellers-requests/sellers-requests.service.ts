import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSellersRequestDto } from './dto/create-sellers-request.dto';
import { UpdateSellersRequestDto } from './dto/update-sellers-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SellersRequest } from './entities/sellers-request.entity';
import { Repository } from 'typeorm';
import { SellersService } from 'src/sellers/sellers.service';
import { SellerRequestEnums } from './enums/sellers-requests-status-enums';
import { ProudctsService } from 'src/proudcts/proudcts.service';

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

  findOne(id: number) {
    return `This action returns a #${id} sellersRequest`;
  }

  update(id: number, updateSellersRequestDto: UpdateSellersRequestDto) {
    return `This action updates a #${id} sellersRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} sellersRequest`;
  }
}
