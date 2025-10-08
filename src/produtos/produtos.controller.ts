import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProdutosRepository } from './produtos.repository';
import { CriaProdutosDTO } from './dto/CriaProdutos.dto';
import { ProdutoEntity } from './produto.entity';
import { v4 as uuid } from 'uuid';
import { AtualizaProdutosDTO } from './dto/AtualizaProduto.dto';

@Controller('/produtos')
export class ProdutosController {
  constructor(private produtosRepository: ProdutosRepository) {}

  @Post()
  async criaProduto(@Body() dadosDoProduto: CriaProdutosDTO) {
    const produtoEntity = new ProdutoEntity();

    produtoEntity.caracteristicas = dadosDoProduto.caracteristicas;
    produtoEntity.categoria = dadosDoProduto.categoria;
    produtoEntity.dataAtualizacao = dadosDoProduto.dataAtualizacao;
    produtoEntity.dataCriacao = dadosDoProduto.dataCriacao;
    produtoEntity.descricao = dadosDoProduto.descricao;
    produtoEntity.imagens = dadosDoProduto.imagens;
    produtoEntity.nome = dadosDoProduto.nome;
    produtoEntity.quantidadeDisponivel = dadosDoProduto.quantidadeDisponivel;
    produtoEntity.valor = dadosDoProduto.valor;
    produtoEntity.id = uuid();

    await this.produtosRepository.criaProduto(produtoEntity);
    return dadosDoProduto;
  }

  @Get()
  async listaProdutos() {
    return this.produtosRepository.listaProdutos();
  }

  @Put('/:id')
  async atualiza(
    @Param('id') id: string,
    @Body() novosDados: AtualizaProdutosDTO,
  ) {
    const produtoAtualizado = this.produtosRepository.atualiza(id, novosDados);

    return {
      produto: produtoAtualizado,
      mensagem: 'Produto atualizado com sucesso!',
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const produtoRemovido = this.produtosRepository.remove(id);
    return {
      produto: produtoRemovido,
      mensagem: 'Produto removido com sucesso!',
    };
  }
}
