import { Produto } from "../domain/Produto.js";
import {
  CreateProdutoData,
  IProdutoRepository,
} from "../domain/IProdutoRepository.js";
import { ICategoriaRepository } from "../../categoria/domain/ICategoriaRepository.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

export class CreateProdutoUseCase {
  constructor(
    private readonly produtoRepository: IProdutoRepository,
    private readonly categoriaRepository: ICategoriaRepository
  ) {}

  async execute(data: CreateProdutoData): Promise<Produto> {
    const categoria = await this.categoriaRepository.findById(data.idCategoria);
    if (!categoria) {
      throw new ValidationError("A categoria informada não existe.");
    }
    return this.produtoRepository.create(data);
  }
}
