interface Caracteristica {
  nome: string;
  descricao: string;
}

interface Imagem {
  url: string;
  descricao: string;
}
export class ProdutoEntity {
  id: string;
  nome: string;
  valor: number;
  quantidadeDisponivel: number;
  descricao: string;
  caracteristicas: Caracteristica[];
  imagens: Imagem[];
  categoria: string;
  dataCriacao: string;
  dataAtualizacao: string;
}
