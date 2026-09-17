import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Seller } from './seller.entity';
import { Product } from 'src/products/entities/proudct.entity';
import { Basket } from 'src/baskets/entities/basket.entity';

@Entity({ name: 'product_seller' })
@Unique(['product', 'seller'])
export class ProductSeller {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'tinyint' })
  discount: number;

  @Column()
  stock: number;

  @ManyToOne(() => Seller, (seller) => seller.productSeller)
  @JoinColumn({ name: 'seller_id' })
  seller: Seller;

  @ManyToOne(() => Product, (product) => product.sellers)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => Basket, (basket) => basket.seller)
  baskets: Basket[];

  @CreateDateColumn({})
  created_at: Date;

  @UpdateDateColumn({})
  updated_at: Date;
}
