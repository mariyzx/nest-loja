import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreateProductDTO } from './dto/CreateProduct.dto';
import { UpdateProductDTO } from './dto/UpdateProduct';
import { ProductService } from './product.service';

@Controller('/products')
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Post()
  async create(@Body() productData: CreateProductDTO) {
    const createdProduct = await this.productService.create(productData);
    return {
      product: createdProduct,
      message: 'Product created successfully!',
    };
  }

  @Get()
  async getProducts() {
    return this.productService.getProducts();
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    return this.productService.getProductById(id);
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
