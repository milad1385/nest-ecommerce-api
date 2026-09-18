import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from './enums/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { Basket } from 'src/baskets/entities/basket.entity';
import { Address } from 'src/address/entities/address.entity';
import { ProductSeller } from 'src/sellers/entities/product_seller.entity';
import { HttpService } from '@nestjs/axios';
import { StartPaymentDto } from './dto/start-payment.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(ProductSeller)
    private readonly productSellerRepository: Repository<ProductSeller>,

    private readonly httpService: HttpService,

    private readonly dataSource: DataSource,
  ) {}

  async createFromBasket(userId: number, dto: CreateOrderDto) {
    const { addressId, paymentMethod, note } = dto;

    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('آدرس یافت نشد');
    }

    const basketItems = await this.basketRepository.find({
      where: { user: { id: userId } },
      relations: {
        product: true,
        productSeller: { seller: true },
      },
    });

    if (!basketItems.length) {
      throw new BadRequestException('سبد خرید شما خالی است');
    }

    for (const item of basketItems) {
      if (!item.productSeller) {
        throw new BadRequestException(
          `محصول "${item.product?.title || 'نامشخص'}" در دسترس نیست`,
        );
      }

      if (item.productSeller.stock < item.quantity) {
        throw new BadRequestException(
          `موجودی "${item.product?.title || 'نامشخص'}" کافی نیست. موجودی: ${item.productSeller.stock}`,
        );
      }
    }

    let totalPrice = 0;
    let totalDiscount = 0;
    let finalPrice = 0;

    const orderItemsData = basketItems.map((item) => {
      const unitPrice = item.productSeller!.price;
      const unitDiscount = item.productSeller!.discount;

      const itemTotalPrice = unitPrice * item.quantity;
      const itemDiscountAmount = Math.round(
        (itemTotalPrice * unitDiscount) / 100,
      );
      const itemFinalPrice = itemTotalPrice - itemDiscountAmount;

      totalPrice += itemTotalPrice;
      totalDiscount += itemDiscountAmount;
      finalPrice += itemFinalPrice;

      return {
        product: item.product,
        productSeller: item.productSeller,
        price: unitPrice,
        discount: unitDiscount,
        quantity: item.quantity,
        itemFinalPrice,
      };
    });

    return await this.dataSource.transaction(async (manager) => {
      const order = manager.create(Order, {
        user: { id: userId },
        address,
        total_price: totalPrice,
        total_discount: totalDiscount,
        final_price: finalPrice,
        status: OrderStatus.PENDING,
        payment_method: paymentMethod || null,
        note: note || null,
      });

      const savedOrder = await manager.save(order);

      const orderItems = orderItemsData.map((data) =>
        manager.create(OrderItem, {
          order: savedOrder,
          product: data.product,
          productSeller: data.productSeller,
          price: data.price,
          discount: data.discount,
          quantity: data.quantity,
        }),
      );

      await manager.save(orderItems);

      for (const data of orderItemsData) {
        if (data.productSeller) {
          await manager.decrement(
            ProductSeller,
            { id: data.productSeller.id },
            'stock',
            data.quantity,
          );
        }
      }

      await manager.delete(Basket, { user: { id: userId } });

      return await manager.findOne(Order, {
        where: { id: savedOrder.id },
        relations: {
          user: true,
          address: true,
          items: {
            product: true,
            productSeller: { seller: true },
          },
        },
      });
    });
  }

  async startPayment(userId: number, dto: StartPaymentDto) {
    const { orderId } = dto;
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { user: true },
    });

    if (!order) {
      throw new NotFoundException('سفارشی با این آیدی یافت نشد');
    }

    const request = this.httpService.post(
      `${process.env.ZIBAL_BASE_URL}/request`,
      {
        merchant: process.env.ZIBAL_MERCHANT_ID,
        amount: order.final_price * 10,
        callbackUrl: 'http://localhost:3000',
        orderId: order.id,
      },
    );

    const responseBody = await lastValueFrom(request);
    return responseBody.data.trackId;
  }

  async verifyPayment(trackId: number, orderId: number) {
    const request = this.httpService.post(
      `${process.env.ZIBAL_BASE_URL}/verify`,
      { merchant: process.env.ZIBAL_MERCHANT_ID, trackId: trackId },
    );

    const responseBody = await lastValueFrom(request);

    if (responseBody.data.result === 100) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('سفارشی با این آیدی یافت نشد');
      }

      if (order.status === OrderStatus.PAID) {
        return responseBody.data;
      }

      order.status = OrderStatus.PAID;
      order.paid_at = new Date();
      order.tracking_code = `${trackId}`;
      await this.orderRepository.save(order);
    }

    return responseBody.data;
  }

  async findMyOrders(
    userId: number,
    query: QueryOrderDto,
  ): Promise<{ items: Order[]; count: number }> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { user: { id: userId } };
    if (status) where.status = status;

    const [items, count] = await this.orderRepository.findAndCount({
      where,
      relations: {
        items: {
          product: true,
          productSeller: { seller: true },
        },
        address: true,
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      count,
    };
  }

  async findOne(id: number, userId?: number) {
    const where: any = { id };
    if (userId) where.user = { id: userId };

    const order = await this.orderRepository.findOne({
      where,
      relations: {
        user: true,
        address: true,
        items: {
          product: true,
          productSeller: { seller: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    return order;
  }

  async findAll(
    query: QueryOrderDto,
  ): Promise<{ items: Order[]; count: number }> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [items, count] = await this.orderRepository.findAndCount({
      where,
      relations: {
        user: true,
        items: {
          product: true,
          productSeller: { seller: true },
        },
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      count,
    };
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const { status, reason } = dto;

    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('سفارش لغو شده قابل تغییر نیست');
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('سفارش تحویل شده قابل تغییر نیست');
    }

    order.status = status;

    switch (status) {
      case OrderStatus.PAID:
        if (!order.paid_at) order.paid_at = new Date();
        break;
      case OrderStatus.SHIPPED:
        if (!order.shipped_at) order.shipped_at = new Date();
        break;
      case OrderStatus.DELIVERED:
        if (!order.delivered_at) order.delivered_at = new Date();
        break;
      case OrderStatus.CANCELLED:
        order.cancelled_at = new Date();
        order.cancel_reason = reason || null;
        break;
    }

    await this.orderRepository.save(order);

    return this.findOne(id);
  }

  async cancelOrder(userId: number, id: number, dto: CancelOrderDto) {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { items: { productSeller: true } },
    });

    if (!order) {
      throw new NotFoundException('سفارش یافت نشد');
    }

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.PAID
    ) {
      throw new BadRequestException('این سفارش در وضعیت فعلی قابل لغو نیست');
    }

    await this.dataSource.transaction(async (manager) => {
      order.status = OrderStatus.CANCELLED;
      order.cancelled_at = new Date();
      order.cancel_reason = dto.reason;

      await manager.save(order);

      for (const item of order.items) {
        if (item.productSeller) {
          await manager.increment(
            ProductSeller,
            { id: item.productSeller.id },
            'stock',
            item.quantity,
          );
        }
      }
    });

    return this.findOne(id, userId);
  }
}
