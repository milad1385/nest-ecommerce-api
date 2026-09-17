import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { ProductSeller } from 'src/sellers/entities/product_seller.entity';
import { SellersModule } from 'src/sellers/sellers.module';
import { SellersRequest } from './entities/sellers-request.entity';
import { SellersRequestsController } from './sellers-requests.controller';
import { SellersRequestsService } from './sellers-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellersRequest , ProductSeller]),
    SellersModule,
    ProductsModule,
  ],
  controllers: [SellersRequestsController],
  providers: [SellersRequestsService],
  exports: [SellersRequestsService],
})
export class SellersRequestsModule {}
