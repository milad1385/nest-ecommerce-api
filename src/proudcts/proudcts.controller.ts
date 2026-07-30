import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProudctsService } from './proudcts.service';
import { CreateProudctDto } from './dto/create-proudct.dto';
import { UpdateProudctDto } from './dto/update-proudct.dto';
import type { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoleEnums } from 'src/users/enums/userRoleEnums';

@Controller('proudcts')
export class ProudctsController {
  constructor(private readonly proudctsService: ProudctsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnums.ADMIN)
  async create(
    @Res() res: Response,
    @Body() createProudctDto: CreateProudctDto,
  ) {
    const product = await this.proudctsService.create(createProudctDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'محصول با موفقیت ساخته شد',
      data: product,
    });
  }

  @Get()
  findAll() {
    return this.proudctsService.findAll();
  }

  @Get(':id')
  findOne(@Param('slug') slug: string) {
    return this.proudctsService.findOne(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProudctDto: UpdateProudctDto) {
    return this.proudctsService.update(+id, updateProudctDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proudctsService.remove(+id);
  }
}
