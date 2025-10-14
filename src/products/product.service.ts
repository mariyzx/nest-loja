import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/CreateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(productData: CreateProductDTO) {
    const productEntity = new ProductEntity();

    productEntity.category = productData.category;
    productEntity.updatedAt = productData.updatedAt;
    productEntity.createdAt = productData.createdAt;
    productEntity.description = productData.description;
    productEntity.name = productData.name;
    productEntity.availableQuantity = productData.availableQuantity;
    productEntity.value = productData.value;
    productEntity.images = productData.images;
    productEntity.specifications = productData.specifications;

    return this.productRepository.save(productEntity);
  }

  async getProducts() {
    return this.productRepository.find();
  }

  async update(id: string, newData: Partial<ProductEntity>) {
    const productExist = await this.productRepository.findOneBy({ id });
    if (!productExist) {
      return null;
    }
    const updatedProduct = await this.productRepository.update(id, newData);
    return updatedProduct;
  }

  async delete(id: string) {
    const productExist = await this.productRepository.findOneBy({ id });
    if (!productExist) {
      return null;
    }
    const deletedProduct = await this.productRepository.delete(id);
    return deletedProduct;
  }
}
