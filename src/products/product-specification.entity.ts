import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product_specifications' })
export class ProductSpecifications {
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
}
