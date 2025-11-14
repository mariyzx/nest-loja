import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreateProductDTO } from './dto/CreateProduct.dto';
import { UpdateProductDTO } from './dto/UpdateProduct';
import { ProductService } from './product.service';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('products')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('/products')
export class ProductsController {
  constructor(private productService: ProductService) {
    console.log('[ProductsController] ✅ Inicializado com CacheInterceptor');
  }

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({ type: CreateProductDTO })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Products not found' })
  async getProducts() {
    const data = await this.productService.getProducts();
    return data;
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);
    return product;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(@Param('id') id: string, @Body() newData: UpdateProductDTO) {
    const updatedProduct = await this.productService.update(id, newData);

    return {
      produto: updatedProduct,
      mensagem: 'Product updated successfully!',
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async delete(@Param('id') id: string) {
    const deletedProduct = await this.productService.delete(id);
    return {
      produto: deletedProduct,
      mensagem: 'Product deleted successfully!',
    };
  }
}
