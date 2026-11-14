import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnums } from '../enums/userRoleEnums';
import { Address } from 'src/address/entities/address.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { Basket } from 'src/baskets/entities/basket.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Role } from 'src/auth/entities/role.entity';
import { Permission } from 'src/auth/entities/permission.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  mobile: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  display_name: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: UserRoleEnums, default: UserRoleEnums.USER })
  role: UserRoleEnums;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToOne(() => Seller, (seller) => seller.user)
  @JoinColumn()
  seller: Seller;

  @OneToMany(() => Basket, (basket) => basket.user)
  baskets: Basket[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'user_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
