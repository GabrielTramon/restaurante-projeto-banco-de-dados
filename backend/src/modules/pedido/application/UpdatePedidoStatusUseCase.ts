import { PedidoDetalhado, PedidoStatus } from "../domain/Pedido.js";
import { IPedidoRepository } from "../domain/IPedidoRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class UpdatePedidoStatusUseCase {
  constructor(private readonly pedidoRepository: IPedidoRepository) {}

  async execute(id: number, status: PedidoStatus): Promise<PedidoDetalhado> {
    const existente = await this.pedidoRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Pedido");
    }
    return this.pedidoRepository.updateStatus(id, status);
  }
}
