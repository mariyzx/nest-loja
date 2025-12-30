import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDTO {
  @IsEmail(undefined, { message: 'Invalid email format' })
  @ApiPropertyOptional({ description: 'The email of the user' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  @ApiProperty({ description: 'The password of the user' })
  password: string;
}
