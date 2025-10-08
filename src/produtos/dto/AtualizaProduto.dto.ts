import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  MinLength,
} from 'class-validator';

export class AtualizaProdutosDTO {
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @IsOptional()
  nome: string;

  @IsPositive({ message: 'O valor deve ser um número positivo' })
  @IsOptional()
  valor: number;

  @IsPositive({ message: 'O valor deve ser um número positivo' })
  @IsOptional()
  quantidadeDisponivel: number;

  @IsNotEmpty({ message: 'A descrição não pode ser vazia' })
  @IsOptional()
  @MinLength(1000, {
    message: 'A descrição deve ter no mínimo 1000 caracteres',
  })
  descricao: string;

  @IsArray({ message: 'As características devem ser um array' })
  @ArrayMinSize(3, {
    message: 'As características devem ter no mínimo 3 itens',
  })
  @IsOptional()
  caracteristicas: { nome: string; descricao: string }[];

  @IsArray({ message: 'As imagens devem ser um array' })
  @ArrayMinSize(1, {
    message: 'As imagens devem ter no mínimo 1 item',
  })
  @IsOptional()
  imagens: { url: string; descricao: string }[];

  @IsNotEmpty({ message: 'A categoria não pode ser vazia' })
  @IsOptional()
  categoria: string;
  dataCriacao: string;
  dataAtualizacao: string;
}
