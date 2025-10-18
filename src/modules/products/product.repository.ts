import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { IProductRepository } from './interface/product.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly ormRepository: Repository<ProductEntity>,
  ) {}

  async create(productData: ProductEntity): Promise<ProductEntity> {
    const product = this.ormRepository.create(productData);
    return await this.ormRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.ormRepository.find();
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return await this.ormRepository.findOneBy({ id });
  }

  async update(
    id: string,
    newData: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    const product = await this.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    Object.assign(product, newData);
    return await this.ormRepository.save(product);
  }

  async delete(id: string): Promise<ProductEntity> {
    const product = await this.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    await this.ormRepository.delete(id);
    return product;
  }

  async findByIds(ids: string[]): Promise<ProductEntity[]> {
    return await this.ormRepository.findByIds(ids);
  }

  async save(product: ProductEntity): Promise<ProductEntity> {
    return await this.ormRepository.save(product);
  }
}
