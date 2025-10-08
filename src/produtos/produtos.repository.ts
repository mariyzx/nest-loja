import { Injectable } from '@nestjs/common';
import { ProdutoEntity } from './produto.entity';

@Injectable()
export class ProdutosRepository {
  private produtos: ProdutoEntity[] = [];
  async criaProduto(dadosDoProduto: ProdutoEntity) {
    this.produtos.push(dadosDoProduto);
    console.log(this.produtos);
  }

  async listaProdutos() {
    console.log(this.produtos);
    return this.produtos;
  }

  private buscaPorId(id: string) {
    const produtoExiste = this.produtos.find((u) => u.id === id);

    if (!produtoExiste) {
      throw new Error('Produto não encontrado');
    }

    return produtoExiste;
  }

  async atualiza(id: string, novosDados: Partial<ProdutoEntity>) {
    const produto = this.buscaPorId(id);

    Object.entries(novosDados).forEach(([chave, valor]) => {
      if (chave === 'id') {
        return;
      }

      if (valor) {
        produto[chave] = valor;
      }
    });

    return produto;
  }

  async remove(id: string) {
    const produto = this.buscaPorId(id);

    this.produtos = this.produtos.filter((u) => u.id !== id);
    return produto;
  }
}
