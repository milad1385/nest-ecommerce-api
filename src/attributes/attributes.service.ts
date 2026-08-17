import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entities/attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepo: Repository<Attribute>,
    @InjectRepository(AttributeValue)
    private attributeValueRepo: Repository<AttributeValue>,
  ) {}



  async create(dto: CreateAttributeDto): Promise<Attribute> {
    const existing = await this.attributeRepo.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(`ویژگی "${dto.name}" قبلاً وجود دارد`);
    }

    const attribute = this.attributeRepo.create(dto);
    return this.attributeRepo.save(attribute);
  }

  async findAll(): Promise<Attribute[]> {
    return this.attributeRepo.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Attribute> {
    const attribute = await this.attributeRepo.findOne({
      where: { id },
      relations: { attributeValues: true },
    });

    if (!attribute) {
      throw new NotFoundException(`ویژگی با ID ${id} یافت نشد`);
    }

    return attribute;
  }

  async findByName(name: string): Promise<Attribute> {
    const attribute = await this.attributeRepo.findOne({
      where: { name },
    });

    if (!attribute) {
      throw new NotFoundException(`ویژگی "${name}" یافت نشد`);
    }

    return attribute;
  }

  async findSearchable(): Promise<Attribute[]> {
    return this.attributeRepo.find({
      where: { isSearchable: true },
      order: { sortOrder: 'ASC' },
    });
  }


  async update(id: number, dto: UpdateAttributeDto): Promise<Attribute> {
    const attribute = await this.findOne(id);

    if (dto.name && dto.name !== attribute.name) {
      const existing = await this.attributeRepo.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException(`ویژگی "${dto.name}" قبلاً وجود دارد`);
      }
    }

    await this.attributeRepo.update(id, dto);
    return this.findOne(id);
  }


  async remove(id: number): Promise<void> {
    const attribute = await this.findOne(id);

    const usageCount = await this.attributeValueRepo.count({
      where: { attribute: { id } },
    });

    if (usageCount > 0) {
      throw new ConflictException(
        `این ویژگی در ${usageCount} محصول استفاده شده و قابل حذف نیست`,
      );
    }

    await this.attributeRepo.delete(id);
  }
}
