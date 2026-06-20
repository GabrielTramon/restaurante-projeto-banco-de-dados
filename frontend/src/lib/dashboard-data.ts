import type {
  Mesa,
  PedidoResumo,
  PontoFaturamento,
  ProdutoMaisVendido,
} from "./types";

export interface DashboardKpis {
  faturamentoHoje: number;
  faturamentoDelta: number; // variação % vs. ontem
  pedidosHoje: number;
  pedidosDelta: number;
  mesasEmUso: number;
  totalMesas: number;
  ticketMedio: number;
  ticketDelta: number;
}

export interface DashboardData {
  kpis: DashboardKpis;
  faturamentoSemana: PontoFaturamento[];
  pedidosRecentes: PedidoResumo[];
  produtosMaisVendidos: ProdutoMaisVendido[];
  mesas: Mesa[];
}

// Relógio relativo ao momento da renderização (no servidor).
const agora = Date.now();
const minAtras = (m: number) => new Date(agora - m * 60_000).toISOString();

/**
 * Retorna os dados do painel.
 *
 * Hoje usa dados de demonstração (coerentes com a seed do backend) para o
 * painel já renderizar bonito sem o servidor no ar. Quando os endpoints de
 * pedidos/pagamentos existirem, troque o corpo por chamadas à API, por exemplo:
 *
 *   import { api } from "./api";
 *   const [produtos, mesas] = await Promise.all([
 *     api.get<Produto[]>("/api/produtos"),
 *     api.get<Mesa[]>("/api/mesas"),
 *   ]);
 *   ...calcule os KPIs a partir dos dados reais.
 */
export async function getDashboardData(): Promise<DashboardData> {
  return {
    kpis: {
      faturamentoHoje: 3210.5,
      faturamentoDelta: 12.5,
      pedidosHoje: 42,
      pedidosDelta: 8,
      mesasEmUso: 6,
      totalMesas: 8,
      ticketMedio: 76.4,
      ticketDelta: 3.2,
    },

    faturamentoSemana: [
      { dia: "Seg", valor: 1820 },
      { dia: "Ter", valor: 2150 },
      { dia: "Qua", valor: 1980 },
      { dia: "Qui", valor: 2560 },
      { dia: "Sex", valor: 3890 },
      { dia: "Sáb", valor: 4620 },
      { dia: "Dom", valor: 3210 },
    ],

    pedidosRecentes: [
      { id: 1042, cliente: "Maria Oliveira", mesa: 2, status: "em_preparo", total: 114.0, itens: 3, horario: minAtras(5) },
      { id: 1041, cliente: "Pedro Santos", mesa: 5, status: "aberto", total: 96.0, itens: 2, horario: minAtras(12) },
      { id: 1040, cliente: "Lucia Ferreira", mesa: null, status: "pronto", total: 95.0, itens: 3, horario: minAtras(20) },
      { id: 1039, cliente: "Rafael Alves", mesa: 6, status: "entregue", total: 139.0, itens: 3, horario: minAtras(35) },
      { id: 1038, cliente: "Camila Rocha", mesa: 1, status: "entregue", total: 162.0, itens: 4, horario: minAtras(50) },
      { id: 1037, cliente: "Bruno Carvalho", mesa: null, status: "cancelado", total: 78.0, itens: 2, horario: minAtras(65) },
    ],

    produtosMaisVendidos: [
      { nome: "Picanha na Brasa", categoria: "Pratos", quantidade: 38, receita: 3382.0 },
      { nome: "Risoto de Camarão", categoria: "Pratos", quantidade: 27, receita: 1836.0 },
      { nome: "Caipirinha", categoria: "Bebidas", quantidade: 64, receita: 1408.0 },
      { nome: "Parmegiana de Frango", categoria: "Pratos", quantidade: 22, receita: 1188.0 },
      { nome: "Pudim de Leite", categoria: "Sobremesas", quantidade: 41, receita: 738.0 },
    ],

    mesas: [
      { id: 1, numero: 1, capacidade: 2, status: "ocupada" },
      { id: 2, numero: 2, capacidade: 4, status: "ocupada" },
      { id: 3, numero: 3, capacidade: 6, status: "reservada" },
      { id: 4, numero: 4, capacidade: 4, status: "disponivel" },
      { id: 5, numero: 5, capacidade: 8, status: "ocupada" },
      { id: 6, numero: 6, capacidade: 2, status: "ocupada" },
      { id: 7, numero: 7, capacidade: 4, status: "reservada" },
      { id: 8, numero: 8, capacidade: 6, status: "disponivel" },
    ],
  };
}
