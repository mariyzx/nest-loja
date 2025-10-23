import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { UpdateOrderDto } from './dto/UpdateOrder.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthenticatedRequest } from '../auth/auth.guard';
@UseGuards(AuthGuard)
@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() orderData: CreateOrderDto,
  ) {
    const { sub } = req.user;
    return this.orderService.createOrder(sub, orderData);
  }

  @Patch('/:orderId')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('orderId') orderId: string,
    @Body() orderData: UpdateOrderDto,
  ) {
    const { sub } = req.user;
    return this.orderService.updateOrder(sub, orderId, orderData);
  }

  @Get()
  async getUserOrders(@Req() req: AuthenticatedRequest) {
    const { sub } = req.user;
    return this.orderService.getUserOrders(sub);
  }

  @Delete('/:orderId')
  async delete(@Param('orderId') orderId: string) {
    return this.orderService.delete(orderId);
  }
}
