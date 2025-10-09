import { Injectable } from '@nestjs/common';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductRepository {
  private products: ProductEntity[] = [];
  async create(productData: ProductEntity) {
    this.products.push(productData);
    console.log(this.products);
  }

  async getProducts() {
    console.log(this.products);
    return this.products;
  }

  private getById(id: string) {
    const productExist = this.products.find((u) => u.id === id);

    if (!productExist) {
      throw new Error('Product not found!');
    }

    return productExist;
  }

  async update(id: string, newData: Partial<ProductEntity>) {
    const product = this.getById(id);

    Object.entries(newData).forEach(([key, value]) => {
      if (key === 'id') {
        return;
      }

      if (value) {
        product[key] = value;
      }
    });

    return product;
  }

  async delete(id: string) {
    const product = this.getById(id);

    this.products = this.products.filter((u) => u.id !== id);
    return product;
  }
}
