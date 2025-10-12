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
import { ProductService } from './product.service';

@Controller('/products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Post()
  async create(@Body() productData: CreateProductDTO) {
    const produtoEntity = new ProductEntity();

    produtoEntity.category = productData.category;
    produtoEntity.updatedAt = productData.updatedAt;
    produtoEntity.createdAt = productData.createdAt;
    produtoEntity.description = productData.description;
    produtoEntity.name = productData.name;
    produtoEntity.availableQuantity = productData.availableQuantity;
    produtoEntity.value = productData.value;
    produtoEntity.id = uuid();
    produtoEntity.images = productData.images;
    produtoEntity.specifications = productData.specifications;

    await this.productService.create(produtoEntity);
    return productData;
  }

  @Get()
  async getProducts() {
    return this.productService.getProducts();
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() newData: UpdateProductDTO) {
    const updatedProduct = await this.productService.update(id, newData);

    return {
      produto: updatedProduct,
      mensagem: 'Product updated successfully!',
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const deletedProduct = await this.productService.delete(id);
    return {
      produto: deletedProduct,
      mensagem: 'Product deleted successfully!',
    };
  }
}
