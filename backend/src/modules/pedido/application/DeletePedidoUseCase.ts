import { IPedidoRepository } from "../domain/IPedidoRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class DeletePedidoUseCase {
  constructor(private readonly pedidoRepository: IPedidoRepository) {}

  async execute(id: number): Promise<void> {
    const existente = await this.pedidoRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Pedido");
    }
    await this.pedidoRepository.delete(id);
  }
}
