import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Product } from 'src/products/entities/proudct.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilterCommentDto } from './dto/filter-comment.dto';
import { CommentStatusEnum } from './enums/comment-status.enum';
import { ProductsService } from 'src/products/products.service';
import { SellersService } from 'src/sellers/sellers.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private readonly productService: ProductsService,
    private readonly sellersService: SellersService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, dto: CreateCommentDto): Promise<Comment> {
    const user = await this.usersService.findOne(userId);

    const product = await this.productService.findOneById(dto.product_id);

    let seller: Seller | null = null;
    if (dto.seller_id) {
      seller = await this.sellersService.findOne(dto.seller_id);
    }

    const comment = this.commentRepository.create({
      content: dto.content,
      rating: dto.rating,
      user,
      product,
      seller,
      status: CommentStatusEnum.PENDING,
    });

    return this.commentRepository.save(comment);
  }
}
