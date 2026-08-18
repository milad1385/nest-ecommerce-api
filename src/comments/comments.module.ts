import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { SellersModule } from 'src/sellers/sellers.module';
import { UsersModule } from 'src/users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { SellersRequestsModule } from 'src/sellers-requests/sellers-requests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    ProductsModule,
    SellersModule,
    UsersModule,
    SellersRequestsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
