import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { isUniqueEmail } from '../validation/unique-email.validator';

export class UpdateUser {
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @IsOptional()
  name: string;

  @IsEmail(undefined, { message: 'O email não é válido' })
  @isUniqueEmail({ message: 'Já existe um usuário com esse email' })
  @IsOptional()
  email: string;

  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @IsOptional()
  password: string;
}
