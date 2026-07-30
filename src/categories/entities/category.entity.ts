import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  title: string;

  @Index()
  @Column({ unique: true })
  slug: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
