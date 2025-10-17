import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './CreateOrder.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNotEmpty({ message: 'Product ID cannot be empty' })
  productId: string;

  @IsNotEmpty({ message: 'Quantity cannot be empty' })
  quantity: number;

  @IsNotEmpty({ message: 'Sell value cannot be empty' })
  sellValue: number;
}
