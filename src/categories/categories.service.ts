import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.findOne(createCategoryDto.slug);
    if (category) {
      throw new BadRequestException('دسته بندی با این مشخصات وجود دارد');
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);

    return await this.categoryRepository.save(newCategory);
  }

  findAll() {
    return `This action returns all categories`;
  }

  async findOne(slug: string) {
    const category = await this.categoryRepository.findOneBy({ slug });
    if (!category) {
      throw new NotFoundException(`دسته بندی با اسلاگ ${slug} یافت نشد`);
    }

    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
