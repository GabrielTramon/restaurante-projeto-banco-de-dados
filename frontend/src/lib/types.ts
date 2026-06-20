// Tipos do domínio, espelhando as entidades do backend.

export type MesaStatus = "disponivel" | "ocupada" | "reservada";

export type PedidoStatus =
  | "aberto"
  | "em_preparo"
  | "pronto"
  | "entregue"
  | "cancelado";

export interface Categoria {
  id: number;
  nome: string;
  descricao: string | null;
}

export interface Produto {
  id: number;
  idCategoria: number;
  nome: string;
  descricao: string | null;
  preco: number;
  disponivel: boolean;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
}

export interface Mesa {
  id: number;
  numero: number;
  capacidade: number;
  status: MesaStatus;
}

export interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  telefone: string | null;
  dataAdmissao: string;
  salario: number;
}

// ----- Tipos auxiliares usados pelo dashboard -----

export interface PedidoResumo {
  id: number;
  cliente: string;
  mesa: number | null;
  status: PedidoStatus;
  total: number;
  itens: number;
  horario: string; // ISO
}

export interface ProdutoMaisVendido {
  nome: string;
  categoria: string;
  quantidade: number;
  receita: number;
}

// ----- Pedido (modelo detalhado vindo da API) -----

export interface PedidoItem {
  id: number;
  idProduto: number;
  produtoNome: string;
  quantidade: number;
  precoUnit: number;
  subtotal: number;
  observacao: string | null;
}

export interface Pedido {
  id: number;
  dataHora: string;
  status: PedidoStatus;
  total: number;
  cliente: { id: number; nome: string } | null;
  mesa: { id: number; numero: number } | null;
  funcionario: { id: number; nome: string } | null;
  itens: PedidoItem[];
}

export interface PontoFaturamento {
  dia: string; // ex.: "Seg"
  valor: number;
}
