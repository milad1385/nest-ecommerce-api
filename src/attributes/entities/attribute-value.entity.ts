import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attribute } from './attribute.entity';
import { Product } from 'src/products/entities/proudct.entity';



/**
 * جدول attribute_values: ذخیره مقادیر ویژگی‌ها برای هر محصول
 * مثال: محصول iPhone => ram=8, storage=256, color=black
 */
@Entity({ name: 'attribute_values' })
export class AttributeValue {
  // شناسه یکتا
  @PrimaryGeneratedColumn('increment')
  id: number;

  // 🔗 رابطه با محصول (هر مقدار به یه محصول تعلق داره)
  @ManyToOne(() => Product, (product) => product.attributeValues, {
    onDelete: 'CASCADE', // اگه محصول حذف شد، مقادیرش هم حذف بشه
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // 🔗 رابطه با ویژگی (هر مقدار به یه ویژگی تعلق داره)
  @ManyToOne(() => Attribute, (attribute) => attribute.attributeValues, {
    onDelete: 'CASCADE', // اگه ویژگی حذف شد، مقادیرش هم حذف بشه
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: Attribute;

  // 📝 مقدار واقعی - مثال: '8', '256', '#000000'
  // ایندکس داره برای جستجوی سریع
  @Index()
  @Column({ type: 'text' })
  value: string;

  // 🔢 مقدار عددی - برای جستجوهای عددی
  // مثال: 8, 256, 42
  // برای جستجوهای بازه‌ای مثل قیمت بین 100 تا 200
  @Index()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  numericValue: number;

  // تاریخ ایجاد
  @CreateDateColumn()
  createdAt: Date;

  // تاریخ بروزرسانی
  @UpdateDateColumn()
  updatedAt: Date;
}
