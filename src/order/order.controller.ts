import { Body, Controller, Param, Patch, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { UpdateOrderDto } from './dto/UpdateOrder.dto';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Query('userId') userId: string, @Body() orderData: CreateOrderDto) {
    return this.orderService.createOrder(userId, orderData);
  }

  @Patch('/:orderId')
  update(@Param('orderId') orderId: string, @Body() orderData: UpdateOrderDto) {
    return this.orderService.updateOrder(orderId, orderData);
  }
}
