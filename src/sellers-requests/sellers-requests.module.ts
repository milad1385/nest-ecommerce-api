import { Module } from '@nestjs/common';
import { SellersRequestsService } from './sellers-requests.service';
import { SellersRequestsController } from './sellers-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellersRequest } from './entities/sellers-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellersRequest])],
  controllers: [SellersRequestsController],
  providers: [SellersRequestsService],
})
export class SellersRequestsModule {}
