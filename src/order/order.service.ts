import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { CreateOrderDto, OrderProductDTO } from './dto/CreateOrder.dto';
import { ProductOrderEntity } from './product-order.entity';
import { ProductEntity } from '../products/product.entity';
import { OrderStatus } from './enum/OrderStatus.enum';
import { UpdateOrderDto } from './dto/UpdateOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createOrder(
    userId: string,
    orderData: CreateOrderDto,
  ): Promise<OrderEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    const orderEntity = new OrderEntity();
    const productsIds = orderData.orderProducts.map((item) => item.productId);
    const relatedProducts = await this.productRepository.findBy({
      id: In(productsIds),
    });

    const itemEntity = orderData.orderProducts.map((item: OrderProductDTO) => {
      const productOrderEntity = new ProductOrderEntity();
      const relatedProduct = relatedProducts.find(
        (prod) => prod.id === item.productId,
      );

      if (relatedProduct) {
        productOrderEntity.product = relatedProduct;
      }

      productOrderEntity.sellValue = relatedProduct ? relatedProduct.value : 0;
      productOrderEntity.quantity = item.quantity;
      productOrderEntity.product.availableQuantity -= item.quantity;

      return productOrderEntity;
    });

    const totalValue = itemEntity.reduce((acc, item) => {
      return acc + item.sellValue * item.quantity;
    }, 0);

    orderEntity.productOrders = itemEntity;
    orderEntity.totalValue = Number(totalValue);
    orderEntity.status = OrderStatus.PENDING;
    orderEntity.user = user;
    return this.orderRepository.save(orderEntity);
  }

  async updateOrder(
    orderId: string,
    orderData: Partial<UpdateOrderDto>,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['productOrders', 'productOrders.product'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    Object.assign(order, orderData);

    return this.orderRepository.save(order);
  }
}
