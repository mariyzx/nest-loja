import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { v4 as uuid } from 'uuid';
import { ProductEntity } from './product.entity';
import { CreateProductDTO } from './dto/CreateProduct.dto';
import { UpdateProductDTO } from './dto/UpdateProduct';
import { ProductRepository } from './product.repository';

@Controller('/products')
export class ProductsController {
  constructor(private productRepository: ProductRepository) {}

  @Post()
  async create(@Body() productData: CreateProductDTO) {
    const produtoEntity = new ProductEntity();

    produtoEntity.specifications = productData.specifications;
    produtoEntity.category = productData.category;
    produtoEntity.updatedAt = productData.updatedAt;
    produtoEntity.createdAt = productData.createdAt;
    produtoEntity.description = productData.description;
    produtoEntity.images = productData.images;
    produtoEntity.name = productData.name;
    produtoEntity.availableQuantity = productData.availableQuantity;
    produtoEntity.value = productData.value;
    produtoEntity.id = uuid();

    await this.productRepository.create(produtoEntity);
    return productData;
  }

  @Get()
  async getProducts() {
    return this.productRepository.getProducts();
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() newData: UpdateProductDTO) {
    const updatedProduct = await this.productRepository.update(id, newData);

    return {
      produto: updatedProduct,
      mensagem: 'Product updated successfully!',
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const deletedProduct = await this.productRepository.delete(id);
    return {
      produto: deletedProduct,
      mensagem: 'Product deleted successfully!',
    };
  }
}
