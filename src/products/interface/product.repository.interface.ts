import { ProductEntity } from '../product.entity';

export interface IProductRepository {
  create(productData: ProductEntity): Promise<ProductEntity>;
  findAll(): Promise<ProductEntity[]>;
  findById(id: string): Promise<ProductEntity | null>;
  update(id: string, newData: Partial<ProductEntity>): Promise<ProductEntity>;
  delete(id: string): Promise<ProductEntity>;
}
