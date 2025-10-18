import { OrderEntity } from '../order.entity';

export interface IOrderRepository {
  create(orderData: OrderEntity): Promise<OrderEntity>;
  findById(id: string): Promise<OrderEntity | null>;
  findByUserId(userId: string): Promise<OrderEntity[]>;
  update(id: string, orderData: Partial<OrderEntity>): Promise<OrderEntity>;
  save(order: OrderEntity): Promise<OrderEntity>;
}
