import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SellerStatusEnums } from '../enums/sellerStatusEnums.enum';
import { User } from 'src/users/entities/user.entity';

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

  @CreateDateColumn({})
  created_at: Date;

  @UpdateDateColumn({})
  updated_at: Date;
}
