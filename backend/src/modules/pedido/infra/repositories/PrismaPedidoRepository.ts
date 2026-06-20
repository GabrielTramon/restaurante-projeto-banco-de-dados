import { Prisma } from "@prisma/client";
import { prisma } from "../../../../shared/infra/prisma/client.js";
import { PedidoDetalhado, PedidoStatus } from "../../domain/Pedido.js";
import {
  CreatePedidoData,
  IPedidoRepository,
} from "../../domain/IPedidoRepository.js";

// Relações carregadas em toda leitura de pedido.
const pedidoInclude = {
  cliente: { select: { id: true, nome: true } },
  mesa: { select: { id: true, numero: true } },
  funcionario: { select: { id: true, nome: true } },
  itens: { include: { produto: { select: { nome: true } } } },
} satisfies Prisma.PedidoInclude;

type PedidoComRelacoes = Prisma.PedidoGetPayload<{ include: typeof pedidoInclude }>;

function toDetalhado(pedido: PedidoComRelacoes): PedidoDetalhado {
  return {
    id: pedido.id,
    dataHora: pedido.dataHora,
    status: pedido.status as PedidoStatus,
    total: Number(pedido.total),
    cliente: pedido.cliente
      ? { id: pedido.cliente.id, nome: pedido.cliente.nome }
      : null,
    mesa: pedido.mesa ? { id: pedido.mesa.id, numero: pedido.mesa.numero } : null,
    funcionario: pedido.funcionario
      ? { id: pedido.funcionario.id, nome: pedido.funcionario.nome }
      : null,
    itens: pedido.itens.map((item) => {
      const precoUnit = Number(item.precoUnit);
      return {
        id: item.id,
        idProduto: item.idProduto,
        produtoNome: item.produto.nome,
        quantidade: item.quantidade,
        precoUnit,
        subtotal: Math.round(precoUnit * item.quantidade * 100) / 100,
        observacao: item.observacao,
      };
    }),
  };
}

export class PrismaPedidoRepository implements IPedidoRepository {
  async create(data: CreatePedidoData): Promise<PedidoDetalhado> {
    const pedido = await prisma.pedido.create({
      data: {
        idMesa: data.idMesa ?? null,
        idFuncionario: data.idFuncionario ?? null,
        idCliente: data.idCliente ?? null,
        status: data.status,
        total: data.total,
        itens: {
          create: data.itens.map((item) => ({
            idProduto: item.idProduto,
            quantidade: item.quantidade,
            precoUnit: item.precoUnit,
            observacao: item.observacao ?? null,
          })),
        },
      },
      include: pedidoInclude,
    });
    return toDetalhado(pedido);
  }

  async findAll(): Promise<PedidoDetalhado[]> {
    const pedidos = await prisma.pedido.findMany({
      include: pedidoInclude,
      orderBy: { dataHora: "desc" },
    });
    return pedidos.map(toDetalhado);
  }

  async findById(id: number): Promise<PedidoDetalhado | null> {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: pedidoInclude,
    });
    return pedido ? toDetalhado(pedido) : null;
  }

  async updateStatus(id: number, status: PedidoStatus): Promise<PedidoDetalhado> {
    const pedido = await prisma.pedido.update({
      where: { id },
      data: { status },
      include: pedidoInclude,
    });
    return toDetalhado(pedido);
  }

  async delete(id: number): Promise<void> {
    await prisma.pedido.delete({ where: { id } });
  }
}
