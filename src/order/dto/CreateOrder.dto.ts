import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class OrderProductDTO {
  @IsUUID()
  productId: string;
  @IsInt({ message: 'Product ID must be an integer' })
  quantity: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @IsArray({ message: 'Order products must be an array' })
  @ArrayMinSize(1)
  @Type(() => OrderProductDTO)
  orderProducts: OrderProductDTO[];
}
