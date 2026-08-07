import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SellerStatusEnums } from '../enums/sellerStatusEnums.enum';
import { SellersRequest } from 'src/sellers-requests/entities/sellers-request.entity';

@Entity({ name: 'sellers' })
export class Seller {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({})
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({})
  postal_code: number;

  @Column({})
  province: string;

  @Column({
    type: 'enum',
    enum: SellerStatusEnums,
    default: SellerStatusEnums.PENDING,
  })
  status: SellerStatusEnums;

  @OneToOne(() => User, (user) => user.seller)
  @JoinColumn()
  user: User;

  @OneToMany(() => SellersRequest, (request) => request.seller)
  requests: SellersRequest[];

  @CreateDateColumn({})
  created_at: Date;

  @UpdateDateColumn({})
  updated_at: Date;
}
