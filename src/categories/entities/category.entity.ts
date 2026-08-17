import { Product } from 'src/products/entities/proudct.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  description: string;

  @OneToMany(() => Category, (category) => category.parent, {
    nullable: true,
    cascade: true,
  })
  categories: Category[];

  @ManyToOne(() => Category, (category) => category.categories)
  parent: Category | null;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
