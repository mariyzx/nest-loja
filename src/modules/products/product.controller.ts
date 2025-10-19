import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { CreateProductDTO } from './dto/CreateProduct.dto';
import { UpdateProductDTO } from './dto/UpdateProduct';
import { ProductService } from './product.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('/products')
export class ProductsController {
  constructor(private productService: ProductService) {
    console.log('[ProductsController] ✅ Inicializado com CacheInterceptor');
  }

  @Post()
  async create(@Body() productData: CreateProductDTO) {
    const createdProduct = await this.productService.create(productData);
    return {
      product: createdProduct,
      message: 'Product created successfully!',
    };
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('products:all')
  @CacheTTL(60000)
  async getProducts() {
    const data = await this.productService.getProducts();
    return data;
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);
    return product;
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
