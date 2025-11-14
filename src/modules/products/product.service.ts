import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { CreateProductDTO } from './dto/CreateProduct.dto';
import { UpdateProductDTO } from './dto/UpdateProduct';
import { ProductRepository } from './product.repository';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async create(productData: CreateProductDTO): Promise<ProductEntity> {
    const productEntity = new ProductEntity();
    Object.assign(productEntity, productData);
    return await this.productRepository.create(productEntity);
  }

  async getProducts(): Promise<ProductEntity[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<ProductEntity | null> {
    let product = await this.cache.get<ProductEntity>(`product:${id}`);

    if (!product) {
      console.log('Cache miss for product id:', id);
      product = await this.productRepository.findById(id);
      await this.cache.set(`product:${id}`, product);
    }

    return product;
  }

  async update(id: string, newData: UpdateProductDTO): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return await this.productRepository.update(
      id,
      newData as Partial<ProductEntity>,
    );
  }

  async delete(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return await this.productRepository.delete(id);
  }
}
