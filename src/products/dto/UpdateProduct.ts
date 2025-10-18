import { IsOptional } from 'class-validator';
import {
  CreateProductDTO,
  ProductImageDTO,
  ProductSpecificationDTO,
} from './CreateProduct.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductDTO extends PartialType(CreateProductDTO) {
  @IsOptional()
  name?: string;

  @IsOptional()
  value?: number;

  @IsOptional()
  availableQuantity?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  specifications?: ProductSpecificationDTO[];

  @IsOptional()
  images?: ProductImageDTO[];

  @IsOptional()
  category?: string;

  @IsOptional()
  createdAt?: string;
  @IsOptional()
  updatedAt?: string;
}
