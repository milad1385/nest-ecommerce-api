import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { ProductsModule } from 'src/products/products.module';
import { SellersModule } from 'src/sellers/sellers.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ProductsModule, SellersModule, UsersModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
