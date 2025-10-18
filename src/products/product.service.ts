import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './dto/CreateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(productData: CreateProductDTO) {
    const productEntity = new ProductEntity();

    Object.assign(productEntity, productData as ProductEntity);

    return this.productRepository.save(productEntity);
  }

  async getProducts() {
    return this.productRepository.find();
  }

  async update(id: string, newData: Partial<ProductEntity>) {
    const productExist = await this.productRepository.findOneBy({ id });
    if (!productExist) {
      throw new NotFoundException('Product not found!');
    }
    Object.assign(productExist, newData as ProductEntity);
    return this.productRepository.save(productExist);
  }

  async delete(id: string) {
    const productExist = await this.productRepository.findOneBy({ id });
    if (!productExist) {
      throw new NotFoundException('Product not found!');
    }
    const deletedProduct = await this.productRepository.delete(id);
    return deletedProduct;
  }
}
