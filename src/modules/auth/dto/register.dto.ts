import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDTO {
    @IsNotEmpty({ message: 'Name must not be empty' })
    @IsString({ message: 'Name must be a string' })
    @ApiProperty({ description: 'The name of the user' })
    name: string;

    @IsEmail(undefined, { message: 'Invalid email format' })
    @ApiPropertyOptional({ description: 'The email of the user' })
    email: string;

    @IsNotEmpty({ message: 'Password must not be empty' })
    @ApiProperty({ description: 'The password of the user' })
    password: string;
}