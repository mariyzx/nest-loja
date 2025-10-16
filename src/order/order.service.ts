import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/user.entity';
import { OrderStatus } from './enum/OrderStatus.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createOrder(userId: string): Promise<OrderEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const orderEntity = new OrderEntity();

    if (!user) {
      throw new Error('User not found');
    }
    orderEntity.totalValue = 0;
    orderEntity.status = OrderStatus.PENDING;
    orderEntity.user = user;

    return this.orderRepository.save(orderEntity);
  }
}
