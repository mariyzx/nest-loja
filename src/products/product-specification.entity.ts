import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_specifications' })
export class ProductSpecificationsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'name', type: 'varchar', length: 200, nullable: false })
  name: string;
  @Column({
    name: 'description',
    type: 'varchar',
    length: 1000,
    nullable: false,
  })
  description: string;

  @ManyToOne(() => ProductEntity, (produto) => produto.specifications)
  product: ProductEntity;
}
