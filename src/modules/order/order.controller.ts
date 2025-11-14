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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() orderData: CreateOrderDto,
  ) {
    const { sub } = req.user;
    return this.orderService.createOrder(sub, orderData);
  }

  @Patch('/:orderId')
  @ApiOperation({ summary: 'Update an order' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('orderId') orderId: string,
    @Body() orderData: UpdateOrderDto,
  ) {
    const { sub } = req.user;
    return this.orderService.updateOrder(sub, orderId, orderData);
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserOrders(@Req() req: AuthenticatedRequest) {
    const { sub } = req.user;
    return this.orderService.getUserOrders(sub);
  }

  @Delete('/:orderId')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async delete(@Param('orderId') orderId: string) {
    return this.orderService.delete(orderId);
  }
}
