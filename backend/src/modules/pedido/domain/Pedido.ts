export type PedidoStatus =
  | "aberto"
  | "em_preparo"
  | "pronto"
  | "entregue"
  | "cancelado";

export interface PedidoItemDetalhado {
  id: number;
  idProduto: number;
  produtoNome: string;
  quantidade: number;
  precoUnit: number;
  subtotal: number;
  observacao: string | null;
}

/** Pedido com os dados relacionados (modelo de leitura para a API). */
export interface PedidoDetalhado {
  id: number;
  dataHora: Date;
  status: PedidoStatus;
  total: number;
  cliente: { id: number; nome: string } | null;
  mesa: { id: number; numero: number } | null;
  funcionario: { id: number; nome: string } | null;
  itens: PedidoItemDetalhado[];
}
