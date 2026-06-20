import { Produto } from "../domain/Produto.js";
import { IProdutoRepository } from "../domain/IProdutoRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class GetProdutoByIdUseCase {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async execute(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findById(id);
    if (!produto) {
      throw new NotFoundError("Produto");
    }
    return produto;
  }
}
