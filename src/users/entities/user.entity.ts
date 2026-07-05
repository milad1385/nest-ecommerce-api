import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEnums } from '../enums/userRoleEnums';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
