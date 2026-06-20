import { Mesa } from "../domain/Mesa.js";
import { IMesaRepository } from "../domain/IMesaRepository.js";

export class ListMesasUseCase {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async execute(): Promise<Mesa[]> {
    return this.mesaRepository.findAll();
  }
}
