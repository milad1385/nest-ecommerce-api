import { Product } from 'src/products/entities/proudct.entity';
import { ProductSeller } from 'src/sellers/entities/product_seller.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'baskets' })
@Unique(['user', 'productSeller'])
export class Basket {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'mediumint', default: 0 })
  quantity: number;

  @Column({ type: 'bigint' })
  price: number;

  @Column({ type: 'tinyint' })
  discount: number;

  @ManyToOne(() => User, (user) => user.baskets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.baskets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductSeller, (productSeller) => productSeller.baskets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_seller_id' })
  productSeller: ProductSeller;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
