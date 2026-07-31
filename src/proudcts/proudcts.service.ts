import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProudctDto } from './dto/create-proudct.dto';
import { UpdateProudctDto } from './dto/update-proudct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proudct } from './entities/proudct.entity';
import {
  Between,
  Brackets,
  In,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { FilterProductDto } from './dto/filter-product.dto';

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

  async findAll(filterDto: any) {
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

    // ========== ۱. ساخت where ==========
    let where: any = {};

    // ========== ۲. جستجو (با OR) ==========
    if (search) {
      where = [
        { title: Like(`%${search}%`) },
        { shortDescription: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
      ];
    }

    // ========== ۳. فیلتر قیمت ==========
    if (minPrice !== undefined || maxPrice !== undefined) {
      if (minPrice !== undefined && maxPrice !== undefined) {
        const priceFilter = Between(Number(minPrice), Number(maxPrice));

        if (Array.isArray(where)) {
          where = where.map((w) => ({ ...w, price: priceFilter }));
        } else {
          where.price = priceFilter;
        }
      } else if (minPrice !== undefined) {
        const priceFilter = MoreThanOrEqual(Number(minPrice));

        if (Array.isArray(where)) {
          where = where.map((w) => ({ ...w, price: priceFilter }));
        } else {
          where.price = priceFilter;
        }
      } else if (maxPrice !== undefined) {
        const priceFilter = LessThanOrEqual(Number(maxPrice));

        if (Array.isArray(where)) {
          where = where.map((w) => ({ ...w, price: priceFilter }));
        } else {
          where.price = priceFilter;
        }
      }
    }

    // ========== ۴. فیلتر موجودی ==========
    if (inStock !== undefined) {
      const stockFilter =
        inStock === 'true' || inStock === true ? MoreThan(0) : 0;

      if (Array.isArray(where)) {
        where = where.map((w) => ({ ...w, stock: stockFilter }));
      } else {
        where.stock = stockFilter;
      }
    }

    if (createdFrom || createdTo) {
      if (createdFrom && createdTo) {
        const fromDate = new Date(createdFrom);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = new Date(createdTo);
        toDate.setHours(23, 59, 59, 999);

        const dateFilter = Between(fromDate, toDate);

        if (Array.isArray(where)) {
          where = where.map((w) => ({ ...w, created_at: dateFilter }));
        } else {
          where.created_at = dateFilter;
        }
      } else if (createdFrom) {
        const fromDate = new Date(createdFrom);
        fromDate.setHours(0, 0, 0, 0);

        const dateFilter = MoreThanOrEqual(fromDate);

        if (Array.isArray(where)) {
          where = where.map((w) => ({ ...w, created_at: dateFilter }));
        } else {
          where.created_at = dateFilter;
        }
      } else if (createdTo) {
        const toDate = new Date(createdTo);
        toDate.setHours(23, 59, 59, 999);

        const dateFilter = LessThanOrEqual(toDate);

        if (Array.isArray(where)) {
          where = where.map((w) => ({ ...w, created_at: dateFilter }));
        } else {
          where.created_at = dateFilter;
        }
      }
    }

    if (categorySlugs && categorySlugs.length > 0) {
      const slugs = Array.isArray(categorySlugs)
        ? categorySlugs
        : [categorySlugs];

      const categories = await this.categoryRepository.find({
        where: { slug: In(slugs) },
      });

      if (categories.length > 0) {
        const categoryIds = categories.map((c) => c.id);

        const productIdsWithCategories = await this.productRepository
          .createQueryBuilder('p')
          .leftJoin('p.categories', 'c')
          .where('c.id IN (:...categoryIds)', { categoryIds })
          .select('p.id')
          .getMany();

        const productIds = productIdsWithCategories.map((p) => p.id);

        if (productIds.length === 0) {
          return {
            items: [],
            meta: {
              total: 0,
              page,
              limit,
              totalPages: 0,
              hasNext: false,
              hasPrevious: false,
            },
          };
        }

        if (Array.isArray(where)) {
          where = where.map((w) => ({ ...w, id: In(productIds) }));
        } else {
          where.id = In(productIds);
        }
      } else {
        return {
          items: [],
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false,
          },
        };
      }
    }

    const [items, total] = await this.productRepository.findAndCount({
      where,
      relations: { categories: true },
      order: {
        [sortField]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  async findByCategorySlug(slug: string, filterDto: any) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
    });

    if (!category) {
      throw new BadRequestException(`دسته‌بندی با اسلاگ "${slug}" یافت نشد`);
    }

    return this.findAll({
      ...filterDto,
      categorySlugs: [slug],
    });
  }

  // ========== دریافت یک محصول با اسلاگ ==========
  async findOneBySlug(slug: string): Promise<Proudct> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: { categories: true },
    });

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

  update(id: number, updateProudctDto: UpdateProudctDto) {
    return `This action updates a #${id} proudct`;
  }

  remove(id: number) {
    return `This action removes a #${id} proudct`;
  }
}
