import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { ProductEntity } from '../products/product.entity';
import { OrderRepository } from './order.repository';
import { UserRepository } from '../users/user.repository';
import { ProductRepository } from '../products/product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, UserEntity, ProductEntity])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, UserRepository, ProductRepository],
})
export class OrderModule {}
