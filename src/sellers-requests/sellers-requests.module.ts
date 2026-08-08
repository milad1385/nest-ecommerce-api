import { Module } from '@nestjs/common';
import { SellersRequestsService } from './sellers-requests.service';
import { SellersRequestsController } from './sellers-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellersRequest } from './entities/sellers-request.entity';
import { SellersModule } from 'src/sellers/sellers.module';
import { ProudctsModule } from 'src/proudcts/proudcts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SellersRequest]),
    SellersModule,
    ProudctsModule,
  ],
  controllers: [SellersRequestsController],
  providers: [SellersRequestsService],
})
export class SellersRequestsModule {}
