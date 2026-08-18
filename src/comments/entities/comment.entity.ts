import { Product } from 'src/products/entities/proudct.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { CommentStatusEnum } from '../enums/comment-status.enum';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'tinyint', default: 5 })
  rating: number;

  @Column({
    type: 'enum',
    enum: CommentStatusEnum,
    default: CommentStatusEnum.PENDING,
  })
  status: CommentStatusEnum;


  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  adminReply: string;


  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;


  @ManyToOne(() => Product, (product) => product.comments, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Seller, (seller) => seller.comments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  seller: Seller | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}