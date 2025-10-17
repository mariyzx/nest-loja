import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'product_order' })
export class ProductOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quantity', nullable: false })
  quantity: number;

  @Column({ name: 'sell_value', nullable: false })
  sellValue: number;

  @ManyToOne(() => ProductEntity, (product) => product.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.productOrders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order: OrderEntity;
}
