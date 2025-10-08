import { Module } from '@nestjs/common';
import { ProdutosController } from './produtos.controller';
import { ProdutosRepository } from './produtos.repository';

@Module({
  controllers: [ProdutosController],
  providers: [ProdutosRepository],
})
export class ProdutosModule {}
