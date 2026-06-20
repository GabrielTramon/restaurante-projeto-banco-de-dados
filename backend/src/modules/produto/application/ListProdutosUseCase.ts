import { Produto } from "../domain/Produto.js";
import { IProdutoRepository } from "../domain/IProdutoRepository.js";

export class ListProdutosUseCase {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async execute(): Promise<Produto[]> {
    return this.produtoRepository.findAll();
  }
}
