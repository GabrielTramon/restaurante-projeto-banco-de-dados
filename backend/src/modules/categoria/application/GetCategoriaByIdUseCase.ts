import { Categoria } from "../domain/Categoria.js";
import { ICategoriaRepository } from "../domain/ICategoriaRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class GetCategoriaByIdUseCase {
  constructor(private readonly categoriaRepository: ICategoriaRepository) {}

  async execute(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) {
      throw new NotFoundError("Categoria");
    }
    return categoria;
  }
}
