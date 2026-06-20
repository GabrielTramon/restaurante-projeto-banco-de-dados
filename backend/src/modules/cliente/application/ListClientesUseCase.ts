import { Cliente } from "../domain/Cliente.js";
import { IClienteRepository } from "../domain/IClienteRepository.js";

export class ListClientesUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(): Promise<Cliente[]> {
    return this.clienteRepository.findAll();
  }
}
