import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('product_images')
export class ProductImage {
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
}
