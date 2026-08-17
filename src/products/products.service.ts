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
import { plainToClass } from 'class-transformer';

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
    query: any,
  ): Promise<{ items: Product[]; count: number; page: number; limit: number }> {
    const attributes: Record<string, string> = {};
    const excludedKeys = [
      'page',
      'limit',
      'search',
      'minPrice',
      'maxPrice',
      'inStock',
      'categorySlugs',
      'createdFrom',
      'createdTo',
      'sortField',
      'sortOrder',
    ];

    for (const key of Object.keys(query)) {
      if (!excludedKeys.includes(key) && query[key]) {
        attributes[key] = query[key];
      }
    }

    const filterDto = plainToClass(FilterProductDto, {
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 10,
      search: query.search,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      categorySlugs: query.categorySlugs,
      createdFrom: query.createdFrom,
      createdTo: query.createdTo,
      sortField: query.sortField || 'created_at',
      sortOrder: query.sortOrder || 'DESC',
      attributes,
    });

    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      categorySlugs,
      createdFrom,
      createdTo,
      sortField = 'created_at',
      sortOrder = 'DESC',
      attributes: filterAttributes = {},
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

    // ==========================================
    // 7️⃣ فیلتر تاریخ
    // ==========================================
    if (createdFrom) {
      qb.andWhere('products.created_at >= :createdFrom', {
        createdFrom: new Date(createdFrom),
      });
    }
    if (createdTo) {
      qb.andWhere('products.created_at <= :createdTo', {
        createdTo: new Date(createdTo),
      });
    }

    // ==========================================
    // 8️⃣ فیلتر دسته‌بندی (اصلاح شده)
    // ==========================================
    if (categorySlugs) {
      // ✅ تعریف نوع درست
      let slugs: string[] = [];

      // بررسی نوع categorySlugs
      if (Array.isArray(categorySlugs)) {
        slugs = categorySlugs;
      } else if (typeof categorySlugs === 'string') {
        // اگر به صورت "laptop,computer" اومده بود
        slugs = (categorySlugs as string).split(',').map((s) => s.trim());
      } else {
        slugs = [categorySlugs as string];
      }

      // حذف مقادیر خالی
      slugs = slugs.filter((s) => s && s.trim() !== '');

      if (slugs.length > 0) {
        const categories = await this.categoryRepository
          .createQueryBuilder('category')
          .where('category.slug IN (:...slugs)', { slugs })
          .getMany();

        if (!categories.length) {
          return { items: [], count: 0, page, limit };
        }

        const categoryIds = categories.map((c) => c.id);
        qb.andWhere(
          `EXISTS (
            SELECT 1 FROM product_category pc 
            WHERE pc.product_id = products.id 
            AND pc.category_id IN (:...categoryIds)
          )`,
          { categoryIds },
        );
      }
    }

    if (Object.keys(filterAttributes).length > 0) {
      let paramIndex = 0;

      for (const [key, value] of Object.entries(filterAttributes)) {
        if (!value) continue;

        const alias = `av${paramIndex}`;
        const keyParam = `key${paramIndex}`;
        const valParam = `val${paramIndex}`;
        const numParam = `num${paramIndex}`;

        const isNumeric = /^\d+$/.test(value);
        const isComma = value.includes(',');

        if (isComma) {
          const values = value.split(',').map((v) => v.trim());
          const numericValues = values
            .map((v) => parseFloat(v))
            .filter((v) => !isNaN(v));

          qb.andWhere(
            `EXISTS (
              SELECT 1 FROM attribute_values ${alias}
              INNER JOIN attributes a${paramIndex} ON a${paramIndex}.id = ${alias}.attribute_id
              WHERE ${alias}.product_id = products.id
              AND a${paramIndex}.name = :${keyParam}
              AND (
                ${alias}.value IN (:...${valParam})
                ${numericValues.length ? `OR ${alias}.numericValue IN (:...${numParam})` : ''}
              )
            )`,
            {
              [`${keyParam}`]: key,
              [`${valParam}`]: values,
              [`${numParam}`]: numericValues,
            },
          );
        } else if (isNumeric) {
          qb.andWhere(
            `EXISTS (
              SELECT 1 FROM attribute_values ${alias}
              INNER JOIN attributes a${paramIndex} ON a${paramIndex}.id = ${alias}.attribute_id
              WHERE ${alias}.product_id = products.id
              AND a${paramIndex}.name = :${keyParam}
              AND (${alias}.value = :${valParam} OR ${alias}.numericValue = :${numParam})
            )`,
            {
              [`${keyParam}`]: key,
              [`${valParam}`]: value,
              [`${numParam}`]: parseFloat(value),
            },
          );
        } else {
          qb.andWhere(
            `EXISTS (
              SELECT 1 FROM attribute_values ${alias}
              INNER JOIN attributes a${paramIndex} ON a${paramIndex}.id = ${alias}.attribute_id
              WHERE ${alias}.product_id = products.id
              AND a${paramIndex}.name = :${keyParam}
              AND ${alias}.value LIKE :${valParam}
            )`,
            {
              [`${keyParam}`]: key,
              [`${valParam}`]: `%${value}%`,
            },
          );
        }

        paramIndex++;
      }
    }

    qb.orderBy(`products.${sortField}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, count] = await qb.getManyAndCount();

    return { items, count, page, limit };
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
