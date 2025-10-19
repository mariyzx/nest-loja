import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderEntity } from './order.entity';
import { CreateOrderDto, OrderProductDTO } from './dto/CreateOrder.dto';
import { ProductOrderEntity } from './product-order.entity';
import { OrderStatus } from './enum/OrderStatus.enum';
import { UpdateOrderDto } from './dto/UpdateOrder.dto';
import { OrderRepository } from './order.repository';
import { UserRepository } from '../../modules/users/user.repository';
import { ProductRepository } from '../../modules/products/product.repository';
import { UserEntity } from '../../modules/users/user.entity';
import { ProductEntity } from '../../modules/products/product.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}
  private async findUser(id: string): Promise<UserEntity> {
    let user = await this.cache.get<UserEntity>(`user:${id}`);

    if (!user) {
      console.log('Cache miss for user id:', id);
      user = await this.userRepository.findById(id);
      if (user === null) {
        throw new NotFoundException('User not found!');
      }
      await this.cache.set(`user:${id}`, user);
    }

    return user;
  }

  private handleOrder(
    orderData: CreateOrderDto,
    relatedProducts: ProductEntity[],
  ) {
    orderData.orderProducts.forEach((item: OrderProductDTO) => {
      const relatedProduct = relatedProducts.find(
        (prod) => prod.id === item.productId,
      );

      if (!relatedProduct) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found!`,
        );
      }

      if (relatedProduct.availableQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ID ${item.productId}!`,
        );
      }
    });
  }

  async createOrder(
    userId: string,
    orderData: CreateOrderDto,
  ): Promise<OrderEntity> {
    const user = await this.findUser(userId);

    const orderEntity = new OrderEntity();
    const productsIds = orderData.orderProducts.map((item) => item.productId);
    const relatedProducts = await this.productRepository.findByIds(productsIds);
    this.handleOrder(orderData, relatedProducts);
    const itemEntity = orderData.orderProducts.map((item: OrderProductDTO) => {
      const productOrderEntity = new ProductOrderEntity();
      const relatedProduct = relatedProducts.find(
        (prod) => prod.id === item.productId,
      );

      productOrderEntity.product = relatedProduct!;
      productOrderEntity.sellValue = relatedProduct!.value;
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
    return await this.orderRepository.update(orderId, orderData);
  }

  async getUserOrders(userId: string): Promise<OrderEntity[]> {
    let userOrders = await this.cache.get<OrderEntity[]>(
      `user_orders:${userId}`,
    );

    if (!userOrders) {
      console.log('Cache miss for user orders, user id:', userId);
      const user = await this.findUser(userId);
      if (!user) {
        throw new NotFoundException('User not found!');
      }
      userOrders = await this.orderRepository.findByUserId(user.id);
      await this.cache.set(`user_orders:${userId}`, userOrders);
      return userOrders;
    }

    return userOrders;
  }

  async delete(orderId: string): Promise<void> {
    return await this.orderRepository.delete(orderId);
  }
}
