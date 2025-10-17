import { Body, Controller, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/CreateOrder.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Query('userId') userId: string, @Body() orderData: CreateOrderDto) {
    return this.orderService.createOrder(userId, orderData);
  }
}
