import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('product_images')
export class ProductImageEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column({ name: 'url', type: 'varchar', length: 200, nullable: false })
  url: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  description: string;

  @ManyToOne(() => ProductEntity, (produto) => produto.images)
  product: ProductEntity;
}
