import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Brackets, In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-proudct.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-proudct.dto';
import { Product } from './entities/proudct.entity';
import { ProductAttributeService } from './product-attribute.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly productAttributeService: ProductAttributeService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const {
      title,
      slug,
      shortDescription,
      description,
      categoryIds,
      attributes,
    } = createProductDto;

    const product = await this.productRepository.findOneBy({ slug });
    if (product) throw new BadRequestException('محصولی با این اسلاگ وجود دارد');

    // 2️⃣ ایجاد محصول
    const newProduct = this.productRepository.create({
      title,
      slug,
      shortDescription,
      description,
    });

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      newProduct.categories = categories;
    }

    const savedProduct = await this.productRepository.save(newProduct);

    if (attributes && Object.keys(attributes).length > 0) {
      await this.productAttributeService.addAttributesToProduct(
        savedProduct.id,
        attributes,
      );
    }
    return this.productRepository.findOne({
      where: { id: savedProduct.id },
      relations: {
        categories: true,
        attributeValues: { attribute: true },
      }, 
    });
  }

  async findAll(
    filterDto: FilterProductDto,
  ): Promise<{ items: Product[]; count: number }> {
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
      attributes,
    } = filterDto;

    const qb = this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.categories', 'categories')
      .leftJoinAndSelect('products.attributeValues', 'attributeValues')
      .leftJoinAndSelect('attributeValues.attribute', 'attribute');

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('products.title LIKE :search')
            .orWhere('products.shortDescription LIKE :search')
            .orWhere('products.description LIKE :search')
            .orWhere('attributeValues.value LIKE :search');
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

    if (attributes && Object.keys(attributes).length > 0) {
      let paramIndex = 0;
      for (const [key, value] of Object.entries(attributes)) {
        if (!value) continue;

        const alias = `av${paramIndex}`;
        const keyParam = `key${paramIndex}`;
        const valueParam = `value${paramIndex}`;

        qb.andWhere(
          `EXISTS (
            SELECT 1 FROM attribute_values ${alias}
            INNER JOIN attributes a${paramIndex} ON a${paramIndex}.id = ${alias}.attribute_id
            WHERE ${alias}.product_id = products.id
            AND a${paramIndex}.name = :${keyParam}
            AND ${alias}.value LIKE :${valueParam}
          )`,
          {
            [`${keyParam}`]: key,
            [`${valueParam}`]: `%${value}%`,
          },
        );

        paramIndex++;
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

  async findOneBySlug(slug: string): Promise<Product> {
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

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} Product`;
  }

  remove(id: number) {
    return `This action removes a #${id} Product`;
  }
}
