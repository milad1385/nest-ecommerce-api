import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProudctDto } from './dto/create-proudct.dto';
import { UpdateProudctDto } from './dto/update-proudct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proudct } from './entities/proudct.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProudctsService {
  constructor(
    @InjectRepository(Proudct)
    private readonly productRepository: Repository<Proudct>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createProudctDto: CreateProudctDto) {
    const { title, slug, shortDescription, description, categoryIds } =
      createProudctDto;

    const product = await this.productRepository.findOneBy({ slug });
    if (product) throw new BadRequestException('محصولی با این اسلاگ وجود دارد');

    const newProduct = this.productRepository.create({
      title,
      slug,
      shortDescription,
      description,
    });

    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      newProduct.categories = categories;
    }

    return await this.productRepository.save(newProduct);
  }

  findAll() {
    return `This action returns all proudcts`;
  }

  async findOne(slug: string) {
    const product = await this.productRepository.findOneBy({ slug });
    if (!product) {
      throw new NotFoundException('محصولی با این اسلاگ یافت نشد');
    }

    return product;
  }

  update(id: number, updateProudctDto: UpdateProudctDto) {
    return `This action updates a #${id} proudct`;
  }

  remove(id: number) {
    return `This action removes a #${id} proudct`;
  }
}
