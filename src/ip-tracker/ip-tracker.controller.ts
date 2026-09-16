import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service';
import { CreateIpTrackerDto } from './dto/create-ip-tracker.dto';
import { UpdateIpTrackerDto } from './dto/update-ip-tracker.dto';

@Controller('ip-tracker')
export class IpTrackerController {
  constructor(private readonly ipTrackerService: IpTrackerService) {}

  @Post()
  create(@Body() createIpTrackerDto: CreateIpTrackerDto) {
    return this.ipTrackerService.create(createIpTrackerDto);
  }

  @Get()
  findAll() {
    return this.ipTrackerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ipTrackerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIpTrackerDto: UpdateIpTrackerDto) {
    return this.ipTrackerService.update(+id, updateIpTrackerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ipTrackerService.remove(+id);
  }
}
