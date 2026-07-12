import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import {
  CreateTicketDto,
  GetTicketDto,
  GetTicketIdDto,
} from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import type { Response } from 'express';
import { createPagination } from 'utils/func';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Res() res: Response,
    @Body() createTicketDto: CreateTicketDto,
    @GetUser('id') userId: number,
  ) {
    const ticket = await this.ticketsService.create(createTicketDto, userId);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'تیکت با موفقیت ساخته شد',
      data: ticket,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Query() getTicketDto: GetTicketDto) {
    const { page, limit } = getTicketDto;
    const { tickets, count } = await this.ticketsService.findAll(getTicketDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'تیکت ها با موفقیت دریافت شد',
      data: {
        tickets,
        pagination: createPagination(page, limit, count, 'Tickets'),
      },
    });
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param() { id }: GetTicketIdDto) {
    const ticket = await this.ticketsService.findOne(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'تیکت با موفقیت دریافت شد',
      data: ticket,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
