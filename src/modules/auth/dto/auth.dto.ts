import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @IsEmail(undefined, { message: 'Invalid email format' })
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  @ApiProperty({ description: 'The password of the user' })
  password: string;
}
