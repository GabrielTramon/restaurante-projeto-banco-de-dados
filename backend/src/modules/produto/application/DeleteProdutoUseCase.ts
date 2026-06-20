import { IProdutoRepository } from "../domain/IProdutoRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class DeleteProdutoUseCase {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async execute(id: number): Promise<void> {
    const existente = await this.produtoRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Produto");
    }
    await this.produtoRepository.delete(id);
  }
}
