import { AttributeValue } from 'src/attributes/entities/attribute-value.entity';
import { Basket } from 'src/baskets/entities/basket.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { SellersRequest } from 'src/sellers-requests/entities/sellers-request.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ unique: true })
  slug: string;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'product_category',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  @OneToMany(() => SellersRequest, (request) => request.product)
  requests: SellersRequest[];

  @OneToMany(() => AttributeValue, (av) => av.product, {
    cascade: true,
  })
  attributeValues: AttributeValue[];

  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.product)
  bookmarks: Bookmark[];

  @OneToMany(() => Basket, (basket) => basket.product)
  baskets: Basket[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
