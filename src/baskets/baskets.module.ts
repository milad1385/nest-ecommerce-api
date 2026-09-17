import { Module } from '@nestjs/common';
import { BasketsService } from './baskets.service';
import { BasketsController } from './baskets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { ProductSeller } from 'src/sellers/entities/product_seller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Basket, ProductSeller])],
  controllers: [BasketsController],
  providers: [BasketsService],
})
export class BasketsModule {}
