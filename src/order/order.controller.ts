import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { UpdateOrderDto } from './dto/UpdateOrder.dto';

@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Query('userId') userId: string,
    @Body() orderData: CreateOrderDto,
  ) {
    return this.orderService.createOrder(userId, orderData);
  }

  @Patch('/:orderId')
  async update(
    @Param('orderId') orderId: string,
    @Body() orderData: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(orderId, orderData);
  }

  @Get()
  async getUserOrders(@Query('userId') userId: string) {
    return this.orderService.getUserOrders(userId);
  }
}
