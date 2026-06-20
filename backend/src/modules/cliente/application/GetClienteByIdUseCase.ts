import { Cliente } from "../domain/Cliente.js";
import { IClienteRepository } from "../domain/IClienteRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class GetClienteByIdUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new NotFoundError("Cliente");
    }
    return cliente;
  }
}
