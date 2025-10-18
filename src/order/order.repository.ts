import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { IOrderRepository } from './interface/order.repository.interface';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ormRepository: Repository<OrderEntity>,
  ) {}

  async create(orderData: OrderEntity): Promise<OrderEntity> {
    const order = this.ormRepository.create(orderData);
    return await this.ormRepository.save(order);
  }

  async findById(id: string): Promise<OrderEntity | null> {
    return await this.ormRepository.findOne({
      where: { id },
      relations: ['productOrders', 'productOrders.product'],
    });
  }

  async findByUserId(userId: string): Promise<OrderEntity[]> {
    return await this.ormRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true,
      },
    });
  }

  async update(
    id: string,
    orderData: Partial<OrderEntity>,
  ): Promise<OrderEntity> {
    const order = await this.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    Object.assign(order, orderData);
    return await this.ormRepository.save(order);
  }

  async save(order: OrderEntity): Promise<OrderEntity> {
    return await this.ormRepository.save(order);
  }
}
