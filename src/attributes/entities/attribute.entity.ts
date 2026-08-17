import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AttributeValue } from './attribute-value.entity';
import { AttributeTypeEnum } from '../enums/attribute-type.enum';

/**
 * جدول attributes: تعریف ویژگی‌ها
 * مثال: رم، حافظه، رنگ، سایز
 */
@Entity({ name: 'attributes' })
export class Attribute {
  // شناسه یکتا - خودکار ساخته میشه
  @PrimaryGeneratedColumn('increment')
  id: number;

  // نام ویژگی (برای استفاده در کد) - مثال: 'ram', 'storage'
  // یکتا هست یعنی دو ویژگی با یه نام نداریم
  @Column({ unique: true })
  name: string;

  // نام نمایشی (برای کاربر) - مثال: 'رم', 'حافظه'
  @Column({ nullable: true })
  displayName: string;

  // واحد اندازه‌گیری - مثال: 'GB', 'MHz', 'سانتی‌متر'
  @Column({ nullable: true })
  unit: string;

  // نوع ویژگی - مشخص میکنه چه نوع داده‌ای قبول میکنه
  @Column({
    type: 'enum',
    enum: AttributeTypeEnum,
    default: AttributeTypeEnum.TEXT,
  })
  type: AttributeTypeEnum;

  // آیا کاربر میتونه بر اساس این ویژگی جستجو کنه؟
  @Column({ default: false })
  isSearchable: boolean;

  // آیا این ویژگی در فیلترها نمایش داده بشه؟
  @Column({ default: true })
  isFilterable: boolean;

  // آیا پر کردن این ویژگی اجباریه؟
  @Column({ default: false })
  isRequired: boolean;

  // گزینه‌های از پیش تعیین شده (برای نوع select)
  // مثال: ['4GB', '8GB', '16GB']
  @Column({ type: 'json', nullable: true })
  options: string[];

  // ترتیب نمایش در فرم
  @Column({ default: 0 })
  sortOrder: number;

  // توضیحات برای ادمین
  @Column({ nullable: true })
  description: string;

  // 🔗 رابطه با جدول attribute_values
  // هر ویژگی میتونه برای چندین محصول مقدار داشته باشه
  @OneToMany(() => AttributeValue, (av) => av.attribute)
  attributeValues: AttributeValue[];

  // تاریخ ایجاد
  @CreateDateColumn()
  createdAt: Date;

  // تاریخ بروزرسانی
  @UpdateDateColumn()
  updatedAt: Date;
}