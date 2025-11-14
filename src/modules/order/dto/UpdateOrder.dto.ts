import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './CreateOrder.dto';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enum/OrderStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(OrderStatus)
  @ApiProperty({ description: 'The status of the order' })
  status: OrderStatus;
}
