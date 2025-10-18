import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { ProductEntity } from '../product.entity';

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
  url: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  product: ProductEntity;
}

export class CreateProductDTO {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsPositive({ message: 'Value must be a positive number' })
  value: number;

  @IsPositive({ message: 'Value must be a positive number' })
  availableQuantity: number;

  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @IsArray({ message: 'Specifications must be an array' })
  @ArrayMinSize(3, {
    message: 'Specifications must have at least 3 items',
  })
  specifications: ProductSpecificationDTO[];

  @IsArray({ message: 'Images must be an array' })
  @ArrayMinSize(1, {
    message: 'Images must have at least 1 item',
  })
  images: ProductImageDTO[];

  @IsNotEmpty({ message: 'Category cannot be empty' })
  category: string;
}
