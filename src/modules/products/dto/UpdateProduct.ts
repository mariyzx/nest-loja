import { IsOptional } from 'class-validator';
import {
  CreateProductDTO,
  ProductImageDTO,
  ProductSpecificationDTO,
} from './CreateProduct.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDTO extends PartialType(CreateProductDTO) {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the product' })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The value of the product' })
  value?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The available quantity of the product' })
  availableQuantity?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The description of the product' })
  description?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The specifications of the product' })
  specifications?: ProductSpecificationDTO[];

  @IsOptional()
  @ApiPropertyOptional({ description: 'The images of the product' })
  images?: ProductImageDTO[];

  @IsOptional()
  @ApiPropertyOptional({ description: 'The category of the product' })
  category?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The created at of the product' })
  createdAt?: string;
  @IsOptional()
  @ApiPropertyOptional({ description: 'The updated at of the product' })
  updatedAt?: string;
}
