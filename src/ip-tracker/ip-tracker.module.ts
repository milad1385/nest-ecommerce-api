import { Module } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpTracker } from './entities/ip-tracker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IpTracker])],
  providers: [IpTrackerService],
  exports: [IpTrackerService],
})
export class IpTrackerModule {}
