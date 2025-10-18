import { Injectable } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { CreateProductDTO } from './dto/CreateProduct.dto';
import { UpdateProductDTO } from './dto/UpdateProduct';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(productData: CreateProductDTO): Promise<ProductEntity> {
    const productEntity = new ProductEntity();
    Object.assign(productEntity, productData);
    return await this.productRepository.create(productEntity);
  }

  async getProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<ProductEntity | null> {
    return await this.productRepository.findById(id);
  }

  async update(id: string, newData: UpdateProductDTO): Promise<ProductEntity> {
    return await this.productRepository.update(
      id,
      newData as Partial<ProductEntity>,
    );
  }

  async delete(id: string): Promise<ProductEntity> {
    return await this.productRepository.delete(id);
  }
}
