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
