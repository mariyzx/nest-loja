import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { isUniqueEmail } from '../validation/unique-email.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @ApiProperty({ description: 'The name of the user' })
  name: string;

  @IsEmail(undefined, { message: 'Email is not valid' })
  @isUniqueEmail({ message: 'A user with this email already exists' })
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,30}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and be between 6 to 30 characters long',
    },
  )
  @ApiProperty({ description: 'The password of the user' })
  password: string;
}
