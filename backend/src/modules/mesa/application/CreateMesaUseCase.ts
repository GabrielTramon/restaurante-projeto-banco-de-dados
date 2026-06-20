import { Mesa } from "../domain/Mesa.js";
import { CreateMesaData, IMesaRepository } from "../domain/IMesaRepository.js";

export class CreateMesaUseCase {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async execute(data: CreateMesaData): Promise<Mesa> {
    // O número da mesa é único (constraint do banco); violação vira 409.
    return this.mesaRepository.create(data);
  }
}
