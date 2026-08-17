import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/proudct.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ProductAttributeService } from './product-attribute.service';
import { AttributeValue } from 'src/attributes/entities/attribute-value.entity';
import { Attribute } from 'src/attributes/entities/attribute.entity';
import { AttributesModule } from 'src/attributes/attributes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, AttributeValue, Attribute]),
    AttributesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductAttributeService],
  exports: [ProductsService, ProductAttributeService],
})
export class ProductsModule {}
