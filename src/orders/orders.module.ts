import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Basket } from 'src/baskets/entities/basket.entity';
import { Address } from 'src/address/entities/address.entity';
import { ProductSeller } from 'src/sellers/entities/product_seller.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Basket,
      Address,
      ProductSeller,
    ]),
    HttpModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
