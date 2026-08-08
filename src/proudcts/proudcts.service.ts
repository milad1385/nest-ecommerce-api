import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Brackets, In, Repository } from 'typeorm';
import { CreateProudctDto } from './dto/create-proudct.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProudctDto } from './dto/update-proudct.dto';
import { Proudct } from './entities/proudct.entity';

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

  async findAll(
    filterDto: FilterProductDto,
  ): Promise<{ items: Proudct[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      inStock,
      categorySlugs,
      createdFrom,
      createdTo,
      sortField = 'created_at',
      sortOrder = 'DESC',
    } = filterDto;

    const qb = this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.categories', 'categories');

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('products.title LIKE :search')
            .orWhere('products.shortDescription LIKE :search')
            .orWhere('products.description LIKE :search');
        }),
        { search: `%${search}%` },
      );
    }

    if (minPrice) {
      qb.andWhere('products.price >= :minPrice', {
        minPrice: Number(minPrice),
      });
    }
    if (maxPrice) {
      qb.andWhere('products.price <= :maxPrice', {
        maxPrice: Number(maxPrice),
      });
    }

    if (inStock) {
      if (inStock === true) {
        qb.andWhere('products.stock > 0');
      } else {
        qb.andWhere('products.stock = 0');
      }
    }

    if (createdFrom) {
      const fromDate = new Date(createdFrom);
      qb.andWhere('products.created_at >= :createdFrom', {
        createdFrom: fromDate,
      });
    }

    if (createdTo) {
      const toDate = new Date(createdTo);
      qb.andWhere('products.created_at <= :createdTo', {
        createdTo: toDate,
      });
    }

    if (categorySlugs && categorySlugs.length > 0) {
      const slugs = Array.isArray(categorySlugs)
        ? categorySlugs
        : [categorySlugs];

      const categories = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.slug IN (:...slugs)', { slugs })
        .getMany();

      if (categories.length > 0) {
        const categoryIds = categories.map((c) => c.id);
        qb.andWhere(
          `EXISTS (
                        SELECT 1 
                        FROM product_category pc 
                        WHERE pc.product_id = products.id 
                        AND pc.category_id IN (:...categoryIds)
                    )`,
          { categoryIds },
        );
      } else {
        return {
          items: [],
          count: 0,
        };
      }
    }

    qb.orderBy(`products.${sortField}`, sortOrder);

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [items, count] = await qb.getManyAndCount();

    return { items, count };
  }

  async findByCategorySlug(slug: string, filterDto: FilterProductDto) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.slug = :slug', { slug })
      .getOne();

    if (!category) {
      throw new BadRequestException(`دسته‌بندی با اسلاگ "${slug}" یافت نشد`);
    }

    return this.findAll({
      ...filterDto,
      categorySlugs: [slug],
    });
  }

  async findOneBySlug(slug: string): Promise<Proudct> {
    const product = await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.categories', 'categories')
      .where('products.slug = :slug', { slug })
      .getOne();

    if (!product) {
      throw new BadRequestException('محصول یافت نشد');
    }

    return product;
  }

  async findOne(slug: string) {
    const product = await this.productRepository.findOneBy({ slug });
    if (!product) {
      throw new NotFoundException('محصولی با این اسلاگ یافت نشد');
    }

    return product;
  }

  async findOneById(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`محصولی با این آیدی ${id} یافت نشد`);
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
