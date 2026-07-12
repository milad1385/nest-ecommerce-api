import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnums } from '../enums/userRoleEnums';
import { Address } from 'src/address/entities/address.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';

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
  tickets : Ticket[]
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
