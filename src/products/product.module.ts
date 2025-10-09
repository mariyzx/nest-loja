import { Module } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductsController } from './product.controller';

@Module({
  controllers: [ProductsController],
  providers: [ProductRepository],
})
export class ProductsModule {}
