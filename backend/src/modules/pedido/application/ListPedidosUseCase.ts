import { PedidoDetalhado } from "../domain/Pedido.js";
import { IPedidoRepository } from "../domain/IPedidoRepository.js";

export class ListPedidosUseCase {
  constructor(private readonly pedidoRepository: IPedidoRepository) {}

  async execute(): Promise<PedidoDetalhado[]> {
    return this.pedidoRepository.findAll();
  }
}
