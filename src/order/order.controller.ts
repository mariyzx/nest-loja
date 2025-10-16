import { Controller, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Param('userId') userId: string) {
    return this.orderService.createOrder(userId);
  }
}
