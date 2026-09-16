import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(dto: CreateMenuDto): Promise<Menu> {
    const { title, slug, parent_id } = dto;

    const existingSlug = await this.menuRepository.findOne({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException('این اسلاگ قبلاً استفاده شده است');
    }

    const existingTitle = await this.menuRepository.findOne({
      where: { title },
    });

    if (existingTitle) {
      throw new ConflictException('این عنوان قبلاً استفاده شده است');
    }

    let parent: Menu | null = null;

    if (parent_id) {
      parent = await this.menuRepository.findOne({
        where: { id: parent_id },
      });

      if (!parent) {
        throw new NotFoundException('منوی والد یافت نشد');
      }
    }

    const menu = this.menuRepository.create({
      title,
      slug,
      parent,
    });

    return await this.menuRepository.save(menu);
  }

  async findAll(): Promise<Menu[]> {
    return await this.menuRepository.find({
      where: { parent: IsNull() },
      relations: { subMenus: { subMenus: true } },
      order: { id: 'ASC' },
    });
  }

  async findAllFlat(): Promise<Menu[]> {
    return await this.menuRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: { subMenus: true, parent: true },
    });

    if (!menu) {
      throw new NotFoundException('منو یافت نشد');
    }

    return menu;
  }

  async findBySlug(slug: string): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { slug },
      relations: { subMenus: true, parent: true },
    });

    if (!menu) {
      throw new NotFoundException('منو یافت نشد');
    }

    return menu;
  }

  async update(id: number, dto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException('منو یافت نشد');
    }

    if (dto.slug && dto.slug !== menu.slug) {
      const existingSlug = await this.menuRepository.findOne({
        where: { slug: dto.slug },
      });

      if (existingSlug) {
        throw new ConflictException('این اسلاگ قبلاً استفاده شده است');
      }
    }

    if (dto.title && dto.title !== menu.title) {
      const existingTitle = await this.menuRepository.findOne({
        where: { title: dto.title },
      });

      if (existingTitle) {
        throw new ConflictException('این عنوان قبلاً استفاده شده است');
      }
    }

    if (dto.parent_id !== undefined) {
      if (dto.parent_id === id) {
        throw new BadRequestException('یک منو نمی‌تواند والد خودش باشد');
      }

      if (dto.parent_id === null) {
        menu.parent = null;
      } else {
        const parent = await this.menuRepository.findOne({
          where: { id: dto.parent_id },
        });

        if (!parent) {
          throw new NotFoundException('منوی والد یافت نشد');
        }

        const isDescendant = await this.isDescendant(id, dto.parent_id);

        if (isDescendant) {
          throw new BadRequestException(
            'نمی‌توانید یک منو را به زیرمنوی خودش تبدیل کنید',
          );
        }

        menu.parent = parent;
      }
    }

    if (dto.title !== undefined) menu.title = dto.title;
    if (dto.slug !== undefined) menu.slug = dto.slug;

    return await this.menuRepository.save(menu);
  }

  async remove(id: number): Promise<{ message: string }> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: { subMenus: true },
    });

    if (!menu) {
      throw new NotFoundException('منو یافت نشد');
    }

    await this.menuRepository.remove(menu);

    return { message: 'منو با موفقیت حذف شد' };
  }

  private async isDescendant(
    ancestorId: number,
    targetId: number,
  ): Promise<boolean> {
    let currentId: number | null = targetId;

    while (currentId) {
      if (currentId === ancestorId) {
        return true;
      }

      const current = await this.menuRepository.findOne({
        where: { id: currentId },
        relations: { parent: true },
      });

      if (!current || !current.parent) {
        return false;
      }

      currentId = current.parent.id;
    }

    return false;
  }
}
