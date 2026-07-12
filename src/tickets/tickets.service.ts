import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto, GetTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { IsNull, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { TicketStatusEnums } from './enums/TicketStatusEnums';

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
      await this.ticketsRepository.update(replyTicket.id, {
        status: TicketStatusEnums.ANSWERED,
      });
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
  async findAll({
    page,
    limit,
    status,
  }: GetTicketDto): Promise<{ tickets: Ticket[]; count: number }> {
    const where: any = {
      reply: IsNull(),
    };

    if (status) {
      where.status = status;
    }

    const count = await this.ticketsRepository.count({ where });

    const tickets = await this.ticketsRepository.find({
      where,
      select: {
        id: true,
        title: true,
        subject: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          display_name: true,
          mobile: true,
          role: true,
          email: true,
          username: true,
        },
        replies: {
          id: true,
          title: true,
          subject: true,
          status: true,
          createdAt: true,
          user: {
            display_name: true,
            mobile: true,
            role: true,
            email: true,
            username: true,
          },
        },
      },
      relations: {
        user: true,
        replies: {
          user: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return { tickets, count };
  }

  async findOne(id: number) {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      select: {
        id: true,
        title: true,
        subject: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          display_name: true,
          mobile: true,
          role: true,
          email: true,
          username: true,
        },
        replies: {
          id: true,
          title: true,
          subject: true,
          status: true,
          createdAt: true,
          user: {
            display_name: true,
            mobile: true,
            role: true,
            email: true,
            username: true,
          },
        },
      },
      relations: {
        user: true,
        replies: {
          user: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!ticket) {
      throw new NotFoundException('تیکت با این آیدی یافت نشد');
    }

    return ticket;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  async remove(id: number) {
    const ticket = await this.findOne(id);
    const deletedTicket = await this.ticketsRepository.delete(id);

    if (deletedTicket.affected === 0) {
      throw new BadRequestException('در هنگام حدف تیکت مشکلی ایجاد شد');
    }

    return ticket;
  }
}
