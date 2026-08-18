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

  async findAll(filterDto: FilterCommentDto): Promise<{
    items: Comment[];
    count: number;
  }> {
    const {
      page = 1,
      limit = 10,
      product_id,
      seller_id,
      user_id,
      status,
      minRating,
      maxRating,
      sortField = 'created_at',
      sortOrder = 'DESC',
    } = filterDto;

    const qb = this.commentRepository
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.user', 'user')
      .leftJoinAndSelect('comments.product', 'product')
      .leftJoinAndSelect('comments.seller', 'seller');

    if (product_id) {
      qb.andWhere('comments.product_id = :product_id', { product_id });
    }

    if (seller_id) {
      qb.andWhere('comments.seller_id = :seller_id', { seller_id });
    }

    if (user_id) {
      qb.andWhere('comments.user_id = :user_id', { user_id });
    }

    if (status) {
      qb.andWhere('comments.status = :status', { status });
    }

    if (minRating) {
      qb.andWhere('comments.rating >= :minRating', { minRating });
    }
    if (maxRating) {
      qb.andWhere('comments.rating <= :maxRating', { maxRating });
    }

    qb.orderBy(`comments.${sortField}`, sortOrder);

    qb.skip((page - 1) * limit).take(limit);

    const [items, count] = await qb.getManyAndCount();

    return { items, count };
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: { user: true, product: true, seller: true },
    });

    if (!comment) {
      throw new NotFoundException(`کامنت با ID ${id} یافت نشد`);
    }

    return comment;
  }

  async findByProduct(productId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        product: { id: productId },
        status: CommentStatusEnum.APPROVED,
      },
      relations: { user: true, seller: true },
      order: { created_at: 'DESC' },
    });
  }

  async findBySeller(sellerId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        seller: { id: sellerId },
        status: CommentStatusEnum.APPROVED,
      },
      relations: { user: true, product: true },
      order: { created_at: 'DESC' },
    });
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.user.id !== userId) {
      throw new ForbiddenException('شما اجازه بروزرسانی این کامنت را ندارید');
    }

    if (comment.status === CommentStatusEnum.APPROVED) {
      throw new BadRequestException('کامنت تایید شده قابل ویرایش نیست');
    }

    if (comment.status === CommentStatusEnum.REJECTED) {
      throw new BadRequestException('کامنت رد شده قابل ویرایش نیست');
    }

    await this.commentRepository.update(id, dto);
    return this.findOne(id);
  }
   async remove(id: number, userId: number): Promise<void> {
    const comment = await this.findOne(id);

    await this.commentRepository.remove(comment);
  }
}
