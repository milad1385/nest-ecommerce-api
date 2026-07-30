import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { IsNull, Repository } from 'typeorm';
import { GetCategoryDto } from './dto/get-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { slug, parentId } = createCategoryDto;
    const category = await this.categoryRepository.findOneBy({
      slug,
    });
    if (category) {
      throw new BadRequestException('دسته بندی با این مشخصات وجود دارد');
    }

    let parentCategory: Category | null = null;
    if (parentId) {
      parentCategory = await this.categoryRepository.findOneBy({
        id: parentId,
      });
      if (!parentCategory) {
        throw new NotFoundException(
          `دسته بندی پرنت با این آیدی ${parentId} یافت نشد`,
        );
      }
    }

    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
      parent: parentCategory,
    });

    return await this.categoryRepository.save(newCategory);
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      relations: {
        categories: {
          categories: {
            categories: true,
          },
        },
      },
      where: { parent: IsNull() },
    });
    return categories;
  }

  async find({
    page,
    limit,
  }: GetCategoryDto): Promise<{ categories: Category[]; count: number }> {
    const count = await this.categoryRepository.count({
      where: { parent: IsNull() },
    });
    const categories = await this.categoryRepository.find({
      relations: {
        categories: {
          categories: {
            categories: true,
          },
        },
      },
      where: { parent: IsNull() },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { categories, count };
  }

  async findOne(slug: string) {
    const category = await this.categoryRepository.findOneBy({ slug });
    if (!category) {
      throw new NotFoundException(`دسته بندی با اسلاگ ${slug} یافت نشد`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(`دسته بندی با این آیدی ${id} یافت نشد`);

    Object.assign(category, updateCategoryDto);

    return this.categoryRepository.save(category);
  }

  async remove(slug: string) {
    const category = await this.findOne(slug);
    return await this.categoryRepository.remove(category);
  }
}
