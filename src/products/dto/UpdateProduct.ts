import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  MinLength,
} from 'class-validator';

export class UpdateProductDTO {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsOptional()
  name: string;

  @IsPositive({ message: 'Value must be a positive number' })
  @IsOptional()
  value: number;

  @IsPositive({ message: 'Value must be a positive number' })
  @IsOptional()
  availableQuantity: number;

  @IsNotEmpty({ message: 'Description cannot be empty' })
  @MinLength(1000, {
    message: 'Description must have at least 1000 characters',
  })
  @IsOptional()
  description: string;

  @IsArray({ message: 'Specifications must be an array' })
  @ArrayMinSize(3, {
    message: 'Specifications must have at least 3 items',
  })
  @IsOptional()
  specifications: { name: string; description: string }[];

  @IsArray({ message: 'Images must be an array' })
  @ArrayMinSize(1, {
    message: 'Images must have at least 1 item',
  })
  @IsOptional()
  images: { url: string; description: string }[];

  @IsNotEmpty({ message: 'Category cannot be empty' })
  @IsOptional()
  category: string;

  createdAt: string;
  updatedAt: string;
}
