import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpTracker } from './entities/ip-tracker.entity';
import { toJalaliDate } from 'utils/func';

@Injectable()
export class IpTrackerService {
  private readonly MAX_REQUESTS = 20;
  private readonly WINDOW_MINUTES = 1;
  private readonly BLOCK_MINUTES = 2;

  constructor(
    @InjectRepository(IpTracker)
    private readonly ipTrackerRepository: Repository<IpTracker>,
  ) {}

  async track(ip: string) {
    const now = new Date();

    let record = await this.ipTrackerRepository.findOne({ where: { ip } });

    if (!record) {
      const newRecord = this.ipTrackerRepository.create({
        ip,
        requestCount: 1,
        windowStart: now,
        isBlock: false,
        blockUntil: null,
      });
      return await this.ipTrackerRepository.save(newRecord);
    }

    if (record.isBlock && record.blockUntil) {
      if (now < record.blockUntil) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: 'Too many Requests',
            message: `${toJalaliDate(record.blockUntil)}` + ` مسدود تا `,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else {
        record.isBlock = false;
        record.blockUntil = null;
        record.requestCount = 1;
        record.windowStart = now;
        return await this.ipTrackerRepository.save(record);
      }
    }

    const windowEnd = new Date(
      record.windowStart.getTime() + this.WINDOW_MINUTES * 60 * 1000,
    );

    if (now > windowEnd) {
      record.requestCount = 1;
      record.windowStart = now;
    } else {
      record.requestCount += 1;

      if (record.requestCount > this.MAX_REQUESTS) {
        record.isBlock = true;
        record.blockUntil = new Date(
          now.getTime() + this.BLOCK_MINUTES * 60 * 1000,
        );
      }
    }

    await this.ipTrackerRepository.save(record);

    if (record.isBlock) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too many Requests',
          message: `شما برای ${this.BLOCK_MINUTES} دقیقه محدود شده اید`,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
