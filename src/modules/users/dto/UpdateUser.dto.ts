import { IsOptional } from 'class-validator';
import { CreateUserDTO } from './CreateUser.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the user' })
  name: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The email of the user' })
  email: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The password of the user' })
  password: string;
}
