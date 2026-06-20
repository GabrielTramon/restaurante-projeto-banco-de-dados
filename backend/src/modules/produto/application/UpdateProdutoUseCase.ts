import { Produto } from "../domain/Produto.js";
import {
  IProdutoRepository,
  UpdateProdutoData,
} from "../domain/IProdutoRepository.js";
import { ICategoriaRepository } from "../../categoria/domain/ICategoriaRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

export class UpdateProdutoUseCase {
  constructor(
    private readonly produtoRepository: IProdutoRepository,
    private readonly categoriaRepository: ICategoriaRepository
  ) {}

  async execute(id: number, data: UpdateProdutoData): Promise<Produto> {
    const existente = await this.produtoRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Produto");
    }

    if (data.idCategoria !== undefined) {
      const categoria = await this.categoriaRepository.findById(data.idCategoria);
      if (!categoria) {
        throw new ValidationError("A categoria informada não existe.");
      }
    }

    return this.produtoRepository.update(id, data);
  }
}
