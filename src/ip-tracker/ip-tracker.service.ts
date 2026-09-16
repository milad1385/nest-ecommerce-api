import { Injectable } from '@nestjs/common';
import { CreateIpTrackerDto } from './dto/create-ip-tracker.dto';
import { UpdateIpTrackerDto } from './dto/update-ip-tracker.dto';

@Injectable()
export class IpTrackerService {
  create(createIpTrackerDto: CreateIpTrackerDto) {
    return 'This action adds a new ipTracker';
  }

  findAll() {
    return `This action returns all ipTracker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ipTracker`;
  }

  update(id: number, updateIpTrackerDto: UpdateIpTrackerDto) {
    return `This action updates a #${id} ipTracker`;
  }

  remove(id: number) {
    return `This action removes a #${id} ipTracker`;
  }
}
