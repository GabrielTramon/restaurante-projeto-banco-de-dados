import { PedidoDetalhado, PedidoStatus } from "./Pedido.js";

export interface CreatePedidoItemData {
  idProduto: number;
  quantidade: number;
  precoUnit: number;
  observacao?: string | null;
}

export interface CreatePedidoData {
  idMesa?: number | null;
  idFuncionario?: number | null;
  idCliente?: number | null;
  status: PedidoStatus;
  total: number;
  itens: CreatePedidoItemData[];
}

export interface IPedidoRepository {
  /** Cria o pedido e seus itens de forma atômica. */
  create(data: CreatePedidoData): Promise<PedidoDetalhado>;
  findAll(): Promise<PedidoDetalhado[]>;
  findById(id: number): Promise<PedidoDetalhado | null>;
  updateStatus(id: number, status: PedidoStatus): Promise<PedidoDetalhado>;
  delete(id: number): Promise<void>;
}
