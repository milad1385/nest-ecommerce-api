import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketStatusEnums } from '../enums/TicketStatusEnums';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  subject: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TicketStatusEnums,
    nullable: true,
  })
  status: TicketStatusEnums;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @OneToMany(() => Ticket, (ticket) => ticket.reply, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  replies: Ticket[];

  @ManyToOne(() => Ticket, (ticket) => ticket.replies)
  reply: Ticket;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
