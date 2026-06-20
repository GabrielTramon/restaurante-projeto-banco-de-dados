import { Categoria } from "../domain/Categoria.js";
import {
  ICategoriaRepository,
  UpdateCategoriaData,
} from "../domain/ICategoriaRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class UpdateCategoriaUseCase {
  constructor(private readonly categoriaRepository: ICategoriaRepository) {}

  async execute(id: number, data: UpdateCategoriaData): Promise<Categoria> {
    const existente = await this.categoriaRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Categoria");
    }
    return this.categoriaRepository.update(id, data);
  }
}
