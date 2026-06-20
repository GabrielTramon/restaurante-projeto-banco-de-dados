import { IClienteRepository } from "../domain/IClienteRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class DeleteClienteUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(id: number): Promise<void> {
    const existente = await this.clienteRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Cliente");
    }
    await this.clienteRepository.delete(id);
  }
}
