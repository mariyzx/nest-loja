import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './CreateOrder.dto';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enum/OrderStatus.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
