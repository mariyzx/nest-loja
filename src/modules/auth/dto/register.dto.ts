import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class RegisterDTO {
    @IsNotEmpty({ message: 'Name must not be empty' })
    @IsString({ message: 'Name must be a string' })
    @ApiProperty({ description: 'The name of the user' })
    name: string;

    @IsEmail(undefined, { message: 'Invalid email format' })
    @ApiPropertyOptional({ description: 'The email of the user' })
    email: string;

    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,30}$/,
        {
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and be between 6 to 30 characters long',
        },
    )
    @IsNotEmpty({ message: 'Password must not be empty' })
    @ApiProperty({ description: 'The password of the user' })
    password: string;
}