import { Module } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductsController } from './product.controller';
import { ProductEntity } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductsController],
  providers: [ProductRepository, ProductService],
})
export class ProductsModule {}
