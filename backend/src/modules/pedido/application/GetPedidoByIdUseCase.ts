import { PedidoDetalhado } from "../domain/Pedido.js";
import { IPedidoRepository } from "../domain/IPedidoRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class GetPedidoByIdUseCase {
  constructor(private readonly pedidoRepository: IPedidoRepository) {}

  async execute(id: number): Promise<PedidoDetalhado> {
    const pedido = await this.pedidoRepository.findById(id);
    if (!pedido) {
      throw new NotFoundError("Pedido");
    }
    return pedido;
  }
}
