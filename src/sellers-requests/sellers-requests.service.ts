import { Injectable } from '@nestjs/common';
import { CreateSellersRequestDto } from './dto/create-sellers-request.dto';
import { UpdateSellersRequestDto } from './dto/update-sellers-request.dto';

@Injectable()
export class SellersRequestsService {
  create(createSellersRequestDto: CreateSellersRequestDto) {
    return 'This action adds a new sellersRequest';
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
