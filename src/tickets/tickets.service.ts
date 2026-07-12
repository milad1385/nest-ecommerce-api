import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly usersService: UsersService,
  ) {}
  async create(
    createTicketDto: CreateTicketDto,
    userId: number,
  ): Promise<Ticket> {
    const user = await this.usersService.findOne(userId);

    let replyTicket: Ticket | null = null;

    if (createTicketDto.replyId) {
      replyTicket = await this.ticketsRepository.findOne({
        where: { id: createTicketDto.replyId },
      });

      if (!replyTicket) {
        throw new NotFoundException('تیکت مورد نظر برای پاسخ یافت نشد');
      }
    }

    const ticketData: Partial<Ticket> = {
      title: createTicketDto.title,
      subject: createTicketDto.subject,
      description: createTicketDto.description,
      status: createTicketDto.status,
      user: user,
      reply: replyTicket || undefined,
    };

    const newTicket = this.ticketsRepository.create(ticketData);

    return await this.ticketsRepository.save(newTicket);
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
