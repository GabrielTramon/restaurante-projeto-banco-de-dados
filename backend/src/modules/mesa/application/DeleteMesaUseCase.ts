import { IMesaRepository } from "../domain/IMesaRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class DeleteMesaUseCase {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async execute(id: number): Promise<void> {
    const existente = await this.mesaRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Mesa");
    }
    await this.mesaRepository.delete(id);
  }
}
