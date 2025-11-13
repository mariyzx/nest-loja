import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { ProductEntity } from '../product.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductSpecificationDTO {
  id: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  product: ProductEntity;
}

export class ProductImageDTO {
  id: string;
  @IsUrl({}, { message: 'URL must be a valid URL' })
  @ApiPropertyOptional({ description: 'The URL of the product image' })
  url: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @ApiPropertyOptional({ description: 'The description of the product image' })
  description: string;

  @ApiPropertyOptional({ description: 'The product' })
  product: ProductEntity;
}

export class CreateProductDTO {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @ApiProperty({ description: 'The name of the product' })
  name: string;

  @IsPositive({ message: 'Value must be a positive number' })
  @ApiProperty({ description: 'The value of the product' })
  value: number;

  @IsPositive({ message: 'Value must be a positive number' })
  @ApiProperty({ description: 'The available quantity of the product' })
  availableQuantity: number;

  @IsNotEmpty({ message: 'Description cannot be empty' })
  @ApiProperty({ description: 'The description of the product' })
  description: string;

  @IsArray({ message: 'Specifications must be an array' })
  @ArrayMinSize(3, {
    message: 'Specifications must have at least 3 items',
  })
  @ApiProperty({ description: 'The specifications of the product' })
  specifications: ProductSpecificationDTO[];

  @IsArray({ message: 'Images must be an array' })
  @ArrayMinSize(1, {
    message: 'Images must have at least 1 item',
  })
  @ApiProperty({ description: 'The images of the product' })
  images: ProductImageDTO[];

  @IsNotEmpty({ message: 'Category cannot be empty' })
  @ApiProperty({ description: 'The category of the product' })
  category: string;
}
