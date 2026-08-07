import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SellerRequestEnums } from '../enums/sellers-requests-status-enums';
import { Seller } from 'src/sellers/entities/seller.entity';
import { Proudct } from 'src/proudcts/entities/proudct.entity';

@Entity({ name: 'sellers_requests' })
export class SellersRequest {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', default: 1 })
  stock: number;

  @Column({ type: 'bigint' })
  price: number;

  @Column({ type: 'tinyint', default: 0 })
  discount: number;

  @Column({
    type: 'enum',
    enum: SellerRequestEnums,
    default: SellerRequestEnums.PENDING,
  })
  status: SellerRequestEnums = SellerRequestEnums.PENDING;

  @Column({ type: 'tinyint', default: 1 })
  priority: number;

  @Column({ nullable: true })
  adminComment: string;

  @ManyToOne(() => Seller, (seller) => seller.requests)
  seller: Seller;

  @ManyToOne(() => Proudct, (product) => product.requests)
  product: Proudct;

  @CreateDateColumn()
  craeted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
