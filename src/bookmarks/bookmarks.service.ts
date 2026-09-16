import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { QueryBookmarkDto } from './dto/query-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
  ) {}

  async toggleBookmark(userId: number, dto: CreateBookmarkDto) {
    const { product_id, note } = dto;

    const existing = await this.bookmarkRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: product_id },
      },
    });

    if (existing) {
      await this.bookmarkRepository.remove(existing);

      return null;
    }

    const bookmark = this.bookmarkRepository.create({
      user: { id: userId },
      product: { id: product_id },
      note: note || null,
    });

    const saved = await this.bookmarkRepository.save(bookmark);

    const result = await this.bookmarkRepository.findOne({
      where: { id: saved.id },
      relations: {
        product: true,
      },
    });

    return result;
  }

  async getUserBookmarks(
    userId: number,
    query: QueryBookmarkDto,
  ): Promise<{ items: Bookmark[]; count: number }> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [items, count] = await this.bookmarkRepository.findAndCount({
      where: {
        user: { id: userId },
      },
      relations: { product: true },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      count,
    };
  }

  async isBookmarked(userId: number, productId: number): Promise<boolean> {
    const count = await this.bookmarkRepository.count({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
    });

    return count > 0;
  }

  async updateNote(userId: number, productId: number, note: string) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
    });

    if (!bookmark) {
      throw new NotFoundException('بوکمارک مورد نظر یافت نشد');
    }

    bookmark.note = note;
    return await this.bookmarkRepository.save(bookmark);
  }

  async getProductBookmarkCount(productId: number): Promise<number> {
    return await this.bookmarkRepository.count({
      where: { product: { id: productId } },
    });
  }
}
