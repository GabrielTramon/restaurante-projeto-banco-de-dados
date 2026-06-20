import { Mesa } from "../domain/Mesa.js";
import { IMesaRepository } from "../domain/IMesaRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class GetMesaByIdUseCase {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async execute(id: number): Promise<Mesa> {
    const mesa = await this.mesaRepository.findById(id);
    if (!mesa) {
      throw new NotFoundError("Mesa");
    }
    return mesa;
  }
}
