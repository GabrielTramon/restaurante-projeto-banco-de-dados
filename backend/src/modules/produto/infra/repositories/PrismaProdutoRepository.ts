import { Produto as PrismaProduto } from "@prisma/client";
import { prisma } from "../../../../shared/infra/prisma/client.js";
import { Produto } from "../../domain/Produto.js";
import {
  CreateProdutoData,
  IProdutoRepository,
  UpdateProdutoData,
} from "../../domain/IProdutoRepository.js";

/** Converte o registro do Prisma (preco: Decimal) na entidade de domínio. */
function toDomain(produto: PrismaProduto): Produto {
  return {
    id: produto.id,
    idCategoria: produto.idCategoria,
    nome: produto.nome,
    descricao: produto.descricao,
    preco: Number(produto.preco),
    disponivel: produto.disponivel,
  };
}

export class PrismaProdutoRepository implements IProdutoRepository {
  async create(data: CreateProdutoData): Promise<Produto> {
    const produto = await prisma.produto.create({ data });
    return toDomain(produto);
  }

  async findAll(): Promise<Produto[]> {
    const produtos = await prisma.produto.findMany({ orderBy: { nome: "asc" } });
    return produtos.map(toDomain);
  }

  async findById(id: number): Promise<Produto | null> {
    const produto = await prisma.produto.findUnique({ where: { id } });
    return produto ? toDomain(produto) : null;
  }

  async update(id: number, data: UpdateProdutoData): Promise<Produto> {
    const produto = await prisma.produto.update({ where: { id }, data });
    return toDomain(produto);
  }

  async delete(id: number): Promise<void> {
    await prisma.produto.delete({ where: { id } });
  }
}
