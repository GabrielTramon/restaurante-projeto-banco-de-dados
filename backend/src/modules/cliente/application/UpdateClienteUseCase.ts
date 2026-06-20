import { Cliente } from "../domain/Cliente.js";
import {
  IClienteRepository,
  UpdateClienteData,
} from "../domain/IClienteRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class UpdateClienteUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: number, data: UpdateClienteData): Promise<Cliente> {
    const existente = await this.clienteRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Cliente");
    }
    return this.clienteRepository.update(id, data);
  }
}
