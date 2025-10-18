import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  private async findUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    if (user === null) {
      throw new NotFoundException('User not found!');
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
    const relatedProducts = await this.productRepository.findBy({
      id: In(productsIds),
    });
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
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['productOrders', 'productOrders.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    Object.assign(order, orderData);

    return this.orderRepository.save(order);
  }

  async getUserOrders(userId: string): Promise<OrderEntity[]> {
    const user = await this.findUser(userId);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.orderRepository.find({
      where: { user: { id: user.id } },
      relations: {
        user: true,
      },
    });
  }
}
