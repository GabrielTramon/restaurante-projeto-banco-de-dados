import { PedidoDetalhado } from "../domain/Pedido.js";
import {
  CreatePedidoItemData,
  IPedidoRepository,
} from "../domain/IPedidoRepository.js";
import { IProdutoRepository } from "../../produto/domain/IProdutoRepository.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

export interface NovoItemPedido {
  idProduto: number;
  quantidade: number;
  observacao?: string | null;
}

export interface CreatePedidoInput {
  idMesa?: number | null;
  idFuncionario?: number | null;
  idCliente?: number | null;
  itens: NovoItemPedido[];
}

export class CreatePedidoUseCase {
  constructor(
    private readonly pedidoRepository: IPedidoRepository,
    private readonly produtoRepository: IProdutoRepository
  ) {}

  async execute(input: CreatePedidoInput): Promise<PedidoDetalhado> {
    if (!input.itens || input.itens.length === 0) {
      throw new ValidationError("O pedido precisa ter ao menos um item.");
    }

    const itens: CreatePedidoItemData[] = [];
    let total = 0;

    // Busca o preço atual de cada produto no servidor (não confia no cliente).
    for (const item of input.itens) {
      const produto = await this.produtoRepository.findById(item.idProduto);
      if (!produto) {
        throw new ValidationError(`Produto ${item.idProduto} não existe.`);
      }
      if (!produto.disponivel) {
        throw new ValidationError(`O produto "${produto.nome}" não está disponível.`);
      }

      itens.push({
        idProduto: produto.id,
        quantidade: item.quantidade,
        precoUnit: produto.preco,
        observacao: item.observacao ?? null,
      });
      total += produto.preco * item.quantidade;
    }

    // Arredonda para 2 casas (centavos).
    total = Math.round(total * 100) / 100;

    return this.pedidoRepository.create({
      idMesa: input.idMesa ?? null,
      idFuncionario: input.idFuncionario ?? null,
      idCliente: input.idCliente ?? null,
      status: "aberto",
      total,
      itens,
    });
  }
}
