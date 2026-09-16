import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Response, Request } from 'express';
import { IpTrackerService } from './ip-tracker.service';

@Injectable()
export class IpTrackerMiddleware implements NestMiddleware {
  constructor(private readonly ipTrackerService: IpTrackerService) {}
  async use(req: Request, res: Response, next: () => void) {
    await this.ipTrackerService.track(req.ip as string);
    next();
  }
}
