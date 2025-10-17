import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, ValidateNested } from 'class-validator';

class OrderProductDTO {
  @IsInt({ message: 'Product ID must be an integer' })
  quantity: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @IsArray({ message: 'Order products must be an array' })
  @ArrayMinSize(1, {
    message: 'Order must contain at least one product',
  })
  @Type(() => OrderProductDTO)
  orderProducts: OrderProductDTO[];
}
