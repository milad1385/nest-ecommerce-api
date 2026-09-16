import { PartialType } from '@nestjs/mapped-types';
import { CreateIpTrackerDto } from './create-ip-tracker.dto';

export class UpdateIpTrackerDto extends PartialType(CreateIpTrackerDto) {}
