import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDTO {
  @IsEmail(undefined, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;
}
