import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { isUniqueEmail } from '../validation/unique-email.validator';

export class CreateUserDTO {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  name: string;

  @IsEmail(undefined, { message: 'O email não é válido' })
  @isUniqueEmail({ message: 'Já existe um usuário com esse email' })
  email: string;

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}
