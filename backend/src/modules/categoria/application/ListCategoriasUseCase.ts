import { Categoria } from "../domain/Categoria.js";
import { ICategoriaRepository } from "../domain/ICategoriaRepository.js";

export class ListCategoriasUseCase {
  constructor(private readonly categoriaRepository: ICategoriaRepository) {}

  async execute(): Promise<Categoria[]> {
    return this.categoriaRepository.findAll();
  }
}
