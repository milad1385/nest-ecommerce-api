import { Product } from 'src/products/entities/proudct.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'baskets' })
export class Basket {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'mediumint', default: 0 })
  quantity: number;

  @Column({ type: 'int' })
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
