import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderProductDTO {
  @IsUUID()
  @ApiProperty({ description: 'The product id' })
  productId: string;
  @IsInt({ message: 'Product ID must be an integer' })
  @ApiProperty({ description: 'The quantity of the product' })
  quantity: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @IsArray({ message: 'Order products must be an array' })
  @ArrayMinSize(1)
  @ApiProperty({ description: 'The order products' })
  @Type(() => OrderProductDTO)
  orderProducts: OrderProductDTO[];
}
