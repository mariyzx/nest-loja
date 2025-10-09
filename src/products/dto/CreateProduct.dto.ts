import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDTO {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsPositive({ message: 'Value must be a positive number' })
  value: number;

  @IsPositive({ message: 'Value must be a positive number' })
  availableQuantity: number;

  @IsNotEmpty({ message: 'Description cannot be empty' })
  @MinLength(1000, {
    message: 'Description must have at least 1000 characters',
  })
  description: string;

  @IsArray({ message: 'Specifications must be an array' })
  @ArrayMinSize(3, {
    message: 'Specifications must have at least 3 items',
  })
  specifications: { name: string; description: string }[];

  @IsArray({ message: 'Images must be an array' })
  @ArrayMinSize(1, {
    message: 'Images must have at least 1 item',
  })
  images: { url: string; description: string }[];

  @IsNotEmpty({ message: 'Category cannot be empty' })
  category: string;

  createdAt: string;
  updatedAt: string;
}
