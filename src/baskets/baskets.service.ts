import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Basket } from './entities/basket.entity';
import { ProductSeller } from 'src/sellers/entities/product_seller.entity';
import { AddToBasketDto } from './dto/add-to-basket.dto';
import { UpdateQuantityDto, QuantityAction } from './dto/update-basket.dto';

@Injectable()
export class BasketsService {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,

    @InjectRepository(ProductSeller)
    private readonly productSellerRepository: Repository<ProductSeller>,
  ) {}

  async addToBasket(userId: number, dto: AddToBasketDto) {
    const { productSellerId, quantity } = dto;

    const productSeller = await this.productSellerRepository.findOne({
      where: { id: productSellerId },
      relations: { product: true, seller: true },
    });

    if (!productSeller) {
      throw new NotFoundException('محصول فروشنده یافت نشد');
    }

    if (productSeller.stock < quantity) {
      throw new BadRequestException('موجودی کافی نیست');
    }

    let basket = await this.basketRepository.findOne({
      where: {
        user: { id: userId },
        productSeller: { id: productSellerId },
      },
    });

    if (basket) {
      const newQuantity = basket.quantity + quantity;

      if (newQuantity > productSeller.stock) {
        throw new BadRequestException('موجودی کافی نیست');
      }

      basket.quantity = newQuantity;
      basket.price = productSeller.price;
      basket.discount = productSeller.discount;

      await this.basketRepository.save(basket);
    } else {
      basket = this.basketRepository.create({
        user: { id: userId },
        product: productSeller.product,
        productSeller,
        quantity,
        price: productSeller.price,
        discount: productSeller.discount,
      });

      await this.basketRepository.save(basket);
    }

    return this.getUserBasket(userId);
  }

  async updateQuantity(
    userId: number,
    basketId: number,
    dto: UpdateQuantityDto,
  ) {
    const { action } = dto;

    const basket = await this.basketRepository.findOne({
      where: { id: basketId, user: { id: userId } },
      relations: { productSeller: true },
    });

    if (!basket) {
      throw new NotFoundException('آیتم سبد خرید یافت نشد');
    }

    if (action === QuantityAction.INCREASE) {
      if (basket.quantity + 1 > basket.productSeller.stock) {
        throw new BadRequestException('موجودی کافی نیست');
      }

      basket.quantity += 1;
      await this.basketRepository.save(basket);
    } else if (action === QuantityAction.DECREASE) {
      if (basket.quantity === 1) {
        await this.basketRepository.remove(basket);
      } else {
        basket.quantity -= 1;
        await this.basketRepository.save(basket);
      }
    }

    return this.getUserBasket(userId);
  }

  async removeItem(userId: number, basketId: number) {
    const basket = await this.basketRepository.findOne({
      where: { id: basketId, user: { id: userId } },
    });

    if (!basket) {
      throw new NotFoundException('آیتم سبد خرید یافت نشد');
    }

    await this.basketRepository.remove(basket);

    return this.getUserBasket(userId);
  }

  async clearBasket(userId: number) {
    await this.basketRepository.delete({ user: { id: userId } });

    return {
      statusCode: 200,
      message: 'سبد خرید با موفقیت خالی شد',
      data: {
        items: [],
        summary: {
          totalItems: 0,
          totalPrice: 0,
          totalDiscount: 0,
          finalPrice: 0,
        },
      },
    };
  }

  async getUserBasket(userId: number, useLivePrice = false) {
    const items = await this.basketRepository.find({
      where: { user: { id: userId } },
      relations: {
        product: true,
        productSeller: { seller: true },
      },
      order: { createdAt: 'DESC' },
    });

    let totalPrice = 0;
    let totalDiscount = 0;
    let finalPrice = 0;

    const formattedItems = items.map((item) => {
      const unitPrice = useLivePrice ? item.productSeller.price : item.price;
      const unitDiscount = useLivePrice
        ? item.productSeller.discount
        : item.discount;

      const itemTotalPrice = unitPrice * item.quantity;

      const itemDiscountAmount = (itemTotalPrice * unitDiscount) / 100;

      const itemFinalPrice = itemTotalPrice - itemDiscountAmount;

      totalPrice += itemTotalPrice;
      totalDiscount += itemDiscountAmount;
      finalPrice += itemFinalPrice;

      return {
        id: item.id,
        quantity: item.quantity,
        unitPrice,
        unitDiscount,
        itemTotalPrice,
        itemDiscountAmount,
        itemFinalPrice,
        product: item.product,
        seller: {
          id: item.productSeller.seller.id,
          name: item.productSeller.seller.name,
          province: item.productSeller.seller.province,
        },
        productSellerId: item.productSeller.id,
        stock: item.productSeller.stock,
      };
    });

    return {
      statusCode: 200,
      message: 'سبد خرید با موفقیت دریافت شد',
      data: {
        items: formattedItems,
        summary: {
          totalItems: items.length,
          totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice,
          totalDiscount,
          finalPrice,
        },
      },
    };
  }


  async getBasketCount(userId: number) {
    const result = await this.basketRepository
      .createQueryBuilder('basket')
      .select('SUM(basket.quantity)', 'total')
      .where('basket.user_id = :userId', { userId })
      .getRawOne();

    return {
      statusCode: 200,
      message: 'تعداد آیتم‌های سبد دریافت شد',
      data: { count: Number(result?.total) || 0 },
    };
  }
}
