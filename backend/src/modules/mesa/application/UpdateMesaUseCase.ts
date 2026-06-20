import { Mesa } from "../domain/Mesa.js";
import { IMesaRepository, UpdateMesaData } from "../domain/IMesaRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class UpdateMesaUseCase {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async execute(id: number, data: UpdateMesaData): Promise<Mesa> {
    const existente = await this.mesaRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Mesa");
    }
    return this.mesaRepository.update(id, data);
  }
}
