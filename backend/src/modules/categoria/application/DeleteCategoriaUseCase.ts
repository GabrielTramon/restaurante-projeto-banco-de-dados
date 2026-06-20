import { ICategoriaRepository } from "../domain/ICategoriaRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class DeleteCategoriaUseCase {
  constructor(private readonly categoriaRepository: ICategoriaRepository) {}

  async execute(id: number): Promise<void> {
    const existente = await this.categoriaRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Categoria");
    }
    await this.categoriaRepository.delete(id);
  }
}
