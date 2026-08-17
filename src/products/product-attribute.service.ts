import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/proudct.entity';
import { AttributeValue } from 'src/attributes/entities/attribute-value.entity';
import { Attribute } from 'src/attributes/entities/attribute.entity';
import { AttributesService } from 'src/attributes/attributes.service';
import { AttributeTypeEnum } from 'src/attributes/enums/attribute-type.enum';

@Injectable()
export class ProductAttributeService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(AttributeValue)
    private attributeValueRepo: Repository<AttributeValue>,
    @InjectRepository(Attribute)
    private attributeRepo: Repository<Attribute>,
    private attributesService: AttributesService,
  ) {}

  // ======================== ADD ========================

  async addAttributeToProduct(
    productId: number,
    attributeName: string,
    value: string,
  ) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`محصول با ID ${productId} یافت نشد`);
    }

    let attribute = await this.attributesService.findByName(attributeName);

    if (!attribute) {
      attribute = await this.attributesService.create({
        name: attributeName,
        displayName: attributeName,
        type: AttributeTypeEnum.TEXT,
      });
    }

    const existing = await this.attributeValueRepo.findOne({
      where: {
        product: { id: productId },
        attribute: { id: attribute.id },
      },
    });

    if (existing) {
      const numericMatch = value.match(/(\d+\.?\d*)/);
      const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0;

      await this.attributeValueRepo.update(existing.id, {
        value,
        numericValue,
      });

      return this.attributeValueRepo.findOne({
        where: { id: existing.id },
        relations: { attribute: true },
      });
    }

    const numericMatch = value.match(/(\d+\.?\d*)/);
    const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0;

    const attributeValue = this.attributeValueRepo.create({
      product,
      attribute,
      value,
      numericValue,
    });

    return this.attributeValueRepo.save(attributeValue);
  }

  async addAttributesToProduct(
    productId: number,
    attributes: Record<string, string>,
  ): Promise<AttributeValue[]> {
    const results: AttributeValue[] = [];

    for (const [name, value] of Object.entries(attributes)) {
      if (value && value.trim() !== '') {
        const result: any = await this.addAttributeToProduct(
          productId,
          name,
          value,
        );
        results.push(result);
      }
    }

    return results;
  }

  async getProductAttributes(
    productId: number,
  ): Promise<Record<string, string>> {
    const attributeValues = await this.attributeValueRepo.find({
      where: { product: { id: productId } },
      relations: { attribute: true },
      order: { attribute: { sortOrder: 'ASC' } },
    });

    const result: Record<string, string> = {};
    attributeValues.forEach((av) => {
      result[av.attribute.name] = av.value;
    });

    return result;
  }

  async getProductAttributeValue(
    productId: number,
    attributeName: string,
  ): Promise<string | null> {
    const attributeValue = await this.attributeValueRepo
      .createQueryBuilder('av')
      .innerJoinAndSelect('av.attribute', 'attribute')
      .where('av.product_id = :productId', { productId })
      .andWhere('attribute.name = :attributeName', { attributeName })
      .getOne();

    return attributeValue ? attributeValue.value : null;
  }

  async updateAttributeValue(
    productId: number,
    attributeName: string,
    newValue: string,
  ) {
    const attributeValue = await this.attributeValueRepo
      .createQueryBuilder('av')
      .innerJoinAndSelect('av.attribute', 'attribute')
      .innerJoinAndSelect('av.product', 'product')
      .where('product.id = :productId', { productId })
      .andWhere('attribute.name = :attributeName', { attributeName })
      .getOne();

    if (!attributeValue) {
      throw new NotFoundException(
        `ویژگی "${attributeName}" برای این محصول یافت نشد`,
      );
    }

    const numericMatch = newValue.match(/(\d+\.?\d*)/);
    const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0;

    await this.attributeValueRepo.update(attributeValue.id, {
      value: newValue,
      numericValue,
    });

    return this.attributeValueRepo.findOne({
      where: { id: attributeValue.id },
      relations: { attribute: true, product: true },
    });
  }

  async updateProductAttributes(
    productId: number,
    attributes: Record<string, string>,
  ): Promise<void> {
    for (const [name, value] of Object.entries(attributes)) {
      if (value && value.trim() !== '') {
        const existing = await this.attributeValueRepo
          .createQueryBuilder('av')
          .innerJoinAndSelect('av.attribute', 'attribute')
          .where('av.product_id = :productId', { productId })
          .andWhere('attribute.name = :attributeName', {
            attributeName: name,
          })
          .getOne();

        if (existing) {
          await this.updateAttributeValue(productId, name, value);
        } else {
          await this.addAttributeToProduct(productId, name, value);
        }
      }
    }
  }

  async removeAttributeFromProduct(
    productId: number,
    attributeName: string,
  ): Promise<void> {
    const attributeValue = await this.attributeValueRepo
      .createQueryBuilder('av')
      .innerJoinAndSelect('av.attribute', 'attribute')
      .where('av.product_id = :productId', { productId })
      .andWhere('attribute.name = :attributeName', { attributeName })
      .getOne();

    if (!attributeValue) {
      throw new NotFoundException(
        `ویژگی "${attributeName}" برای این محصول یافت نشد`,
      );
    }

    await this.attributeValueRepo.delete(attributeValue.id);
  }

  async clearProductAttributes(productId: number): Promise<void> {
    await this.attributeValueRepo.delete({
      product: { id: productId },
    });
  }
}
