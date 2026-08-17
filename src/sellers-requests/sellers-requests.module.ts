import { Module } from '@nestjs/common';
import { SellersRequestsService } from './sellers-requests.service';
import { SellersRequestsController } from './sellers-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellersRequest } from './entities/sellers-request.entity';
import { SellersModule } from 'src/sellers/sellers.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellersRequest]),
    SellersModule,
    ProductsModule,
  ],
  controllers: [SellersRequestsController],
  providers: [SellersRequestsService],
})
export class SellersRequestsModule {}
