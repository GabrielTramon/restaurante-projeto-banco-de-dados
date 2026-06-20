import { Categoria } from "../domain/Categoria.js";
import {
  CreateCategoriaData,
  ICategoriaRepository,
} from "../domain/ICategoriaRepository.js";

export class CreateCategoriaUseCase {
  constructor(private readonly categoriaRepository: ICategoriaRepository) {}

  async execute(data: CreateCategoriaData): Promise<Categoria> {
    return this.categoriaRepository.create(data);
  }
}
