import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CriaProdutosDTO {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  nome: string;
  @IsPositive({ message: 'O valor deve ser um número positivo' })
  valor: number;

  @IsPositive({ message: 'O valor deve ser um número positivo' })
  quantidadeDisponivel: number;

  @IsNotEmpty({ message: 'A descrição não pode ser vazia' })
  @MinLength(1000, {
    message: 'A descrição deve ter no mínimo 1000 caracteres',
  })
  descricao: string;
  @IsArray({ message: 'As características devem ser um array' })
  @ArrayMinSize(3, {
    message: 'As características devem ter no mínimo 3 itens',
  })
  caracteristicas: { nome: string; descricao: string }[];
  @IsArray({ message: 'As imagens devem ser um array' })
  @ArrayMinSize(1, {
    message: 'As imagens devem ter no mínimo 1 item',
  })
  imagens: { url: string; descricao: string }[];
  @IsNotEmpty({ message: 'A categoria não pode ser vazia' })
  categoria: string;
  dataCriacao: string;
  dataAtualizacao: string;
}
