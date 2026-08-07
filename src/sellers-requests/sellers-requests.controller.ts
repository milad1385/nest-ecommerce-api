import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellersRequestsService } from './sellers-requests.service';
import { CreateSellersRequestDto } from './dto/create-sellers-request.dto';
import { UpdateSellersRequestDto } from './dto/update-sellers-request.dto';

@Controller('sellers-requests')
export class SellersRequestsController {
  constructor(private readonly sellersRequestsService: SellersRequestsService) {}

  @Post()
  create(@Body() createSellersRequestDto: CreateSellersRequestDto) {
    return this.sellersRequestsService.create(createSellersRequestDto);
  }

  @Get()
  findAll() {
    return this.sellersRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellersRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellersRequestDto: UpdateSellersRequestDto) {
    return this.sellersRequestsService.update(+id, updateSellersRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellersRequestsService.remove(+id);
  }
}
