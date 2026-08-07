import { Module } from '@nestjs/common';
import { SellersRequestsService } from './sellers-requests.service';
import { SellersRequestsController } from './sellers-requests.controller';

@Module({
  controllers: [SellersRequestsController],
  providers: [SellersRequestsService],
})
export class SellersRequestsModule {}
