import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

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

  // specifications: Specifications[];
  // images: Image[];

  @Column({ name: 'category', type: 'varchar', length: 200, nullable: false })
  category: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
