import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ProductSpecificationsEntity } from './product-specification.entity';
import { ProductImageEntity } from './product-image.entity';
import { OrderEntity } from './product-order.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ name: 'value', type: 'float', nullable: false })
  value: number;

  @Column({ name: 'available_quantity', type: 'int', nullable: false })
  availableQuantity: number;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  description: string;

  @OneToMany(
    () => ProductSpecificationsEntity,
    (productSpecificationEntity) => productSpecificationEntity.product,
    { cascade: true, eager: true },
  )
  specifications: ProductSpecificationsEntity[];

  @OneToMany(
    () => ProductImageEntity,
    (productImageEntity) => productImageEntity.product,
    { cascade: true, eager: true },
  )
  images: ProductImageEntity[];

  @Column({ name: 'category', type: 'varchar', length: 200, nullable: false })
  category: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @OneToMany(() => OrderEntity, (order) => order.product, {
    cascade: true, // cria automaticamente as ordens relacionadas ao produto
  })
  orders: OrderEntity[];
}
