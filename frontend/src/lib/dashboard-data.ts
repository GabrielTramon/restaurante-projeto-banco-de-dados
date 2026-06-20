import { api } from "./api";
import type {
  Categoria,
  Mesa,
  Pedido,
  PedidoResumo,
  PontoFaturamento,
  Produto,
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

// Pedido cancelado não entra em faturamento nem nas estatísticas.
const faturavel = (p: Pedido) => p.status !== "cancelado";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Zera as horas para comparar pedidos por dia de calendário (horário local). */
function inicioDoDia(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Variação percentual entre dois períodos, arredondada a 1 casa. */
function variacaoPct(atual: number, anterior: number): number {
  if (anterior === 0) return atual > 0 ? 100 : 0;
  return Math.round(((atual - anterior) / anterior) * 1000) / 10;
}

/**
 * Calcula os KPIs e listas do painel a partir dos dados reais da API.
 *
 * Tudo é derivado dos pedidos/mesas/produtos cadastrados — não há mais dados
 * fixos. Se a API estiver indisponível, devolve um painel vazio (zeros) para
 * a página renderizar mesmo assim, em vez de quebrar.
 */
export async function getDashboardData(): Promise<DashboardData> {
  let pedidos: Pedido[] = [];
  let mesas: Mesa[] = [];
  let produtos: Produto[] = [];
  let categorias: Categoria[] = [];

  try {
    [pedidos, mesas, produtos, categorias] = await Promise.all([
      api.get<Pedido[]>("/api/pedidos"),
      api.get<Mesa[]>("/api/mesas"),
      api.get<Produto[]>("/api/produtos"),
      api.get<Categoria[]>("/api/categorias"),
    ]);
  } catch {
    // Backend fora do ar: devolve painel vazio em vez de derrubar a home.
    return painelVazio();
  }

  const agora = new Date();
  const inicioHoje = inicioDoDia(agora);
  const inicioOntem = inicioDoDia(new Date(agora.getTime() - 86_400_000));

  // ----- KPIs de hoje x ontem -----
  let faturamentoHoje = 0;
  let pedidosHoje = 0;
  let faturamentoOntem = 0;
  let pedidosOntem = 0;

  for (const pedido of pedidos) {
    if (!faturavel(pedido)) continue;
    const data = new Date(pedido.dataHora);
    if (data >= inicioHoje) {
      faturamentoHoje += pedido.total;
      pedidosHoje += 1;
    } else if (data >= inicioOntem) {
      faturamentoOntem += pedido.total;
      pedidosOntem += 1;
    }
  }

  const ticketMedio = pedidosHoje > 0 ? faturamentoHoje / pedidosHoje : 0;
  const ticketOntem = pedidosOntem > 0 ? faturamentoOntem / pedidosOntem : 0;
  const mesasEmUso = mesas.filter((m) => m.status === "ocupada").length;

  // ----- Faturamento dos últimos 7 dias -----
  const faturamentoSemana: PontoFaturamento[] = [];
  for (let i = 6; i >= 0; i--) {
    const dia = inicioDoDia(new Date(agora.getTime() - i * 86_400_000));
    const fim = new Date(dia.getTime() + 86_400_000);
    const valor = pedidos.reduce((acc, p) => {
      if (!faturavel(p)) return acc;
      const data = new Date(p.dataHora);
      return data >= dia && data < fim ? acc + p.total : acc;
    }, 0);
    faturamentoSemana.push({ dia: DIAS_SEMANA[dia.getDay()], valor });
  }

  // ----- Produtos mais vendidos (agregado de todos os pedidos válidos) -----
  const categoriaPorId = new Map(categorias.map((c) => [c.id, c.nome]));
  const produtoPorId = new Map(produtos.map((p) => [p.id, p]));
  const agregado = new Map<
    number,
    { nome: string; categoria: string; quantidade: number; receita: number }
  >();

  for (const pedido of pedidos) {
    if (!faturavel(pedido)) continue;
    for (const item of pedido.itens) {
      const produto = produtoPorId.get(item.idProduto);
      const categoria = produto
        ? categoriaPorId.get(produto.idCategoria) ?? "—"
        : "—";
      const atual = agregado.get(item.idProduto) ?? {
        nome: item.produtoNome,
        categoria,
        quantidade: 0,
        receita: 0,
      };
      atual.quantidade += item.quantidade;
      atual.receita += item.subtotal;
      agregado.set(item.idProduto, atual);
    }
  }

  const produtosMaisVendidos = [...agregado.values()]
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 5);

  // ----- Pedidos recentes (a API já retorna ordenado por dataHora desc) -----
  const pedidosRecentes: PedidoResumo[] = pedidos.slice(0, 6).map((p) => ({
    id: p.id,
    cliente: p.cliente?.nome ?? "—",
    mesa: p.mesa?.numero ?? null,
    status: p.status,
    total: p.total,
    itens: p.itens.length,
    horario: p.dataHora,
  }));

  return {
    kpis: {
      faturamentoHoje,
      faturamentoDelta: variacaoPct(faturamentoHoje, faturamentoOntem),
      pedidosHoje,
      pedidosDelta: variacaoPct(pedidosHoje, pedidosOntem),
      mesasEmUso,
      totalMesas: mesas.length,
      ticketMedio,
      ticketDelta: variacaoPct(ticketMedio, ticketOntem),
    },
    faturamentoSemana,
    pedidosRecentes,
    produtosMaisVendidos,
    mesas,
  };
}

/** Painel zerado, usado quando a API está indisponível. */
function painelVazio(): DashboardData {
  const agora = new Date();
  const faturamentoSemana: PontoFaturamento[] = [];
  for (let i = 6; i >= 0; i--) {
    const dia = inicioDoDia(new Date(agora.getTime() - i * 86_400_000));
    faturamentoSemana.push({ dia: DIAS_SEMANA[dia.getDay()], valor: 0 });
  }

  return {
    kpis: {
      faturamentoHoje: 0,
      faturamentoDelta: 0,
      pedidosHoje: 0,
      pedidosDelta: 0,
      mesasEmUso: 0,
      totalMesas: 0,
      ticketMedio: 0,
      ticketDelta: 0,
    },
    faturamentoSemana,
    pedidosRecentes: [],
    produtosMaisVendidos: [],
    mesas: [],
  };
}
