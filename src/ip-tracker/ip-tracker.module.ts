import { Module } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service';
import { IpTrackerController } from './ip-tracker.controller';

@Module({
  controllers: [IpTrackerController],
  providers: [IpTrackerService],
})
export class IpTrackerModule {}
