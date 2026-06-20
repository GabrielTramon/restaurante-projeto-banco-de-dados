import { prisma } from "../../../../shared/infra/prisma/client.js";
import { Categoria } from "../../domain/Categoria.js";
import {
  CreateCategoriaData,
  ICategoriaRepository,
  UpdateCategoriaData,
} from "../../domain/ICategoriaRepository.js";

export class PrismaCategoriaRepository implements ICategoriaRepository {
  async create(data: CreateCategoriaData): Promise<Categoria> {
    return prisma.categoria.create({ data });
  }

  async findAll(): Promise<Categoria[]> {
    return prisma.categoria.findMany({ orderBy: { nome: "asc" } });
  }

  async findById(id: number): Promise<Categoria | null> {
    return prisma.categoria.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateCategoriaData): Promise<Categoria> {
    return prisma.categoria.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prisma.categoria.delete({ where: { id } });
  }
}
