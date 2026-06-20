import { prisma } from "../../../../shared/infra/prisma/client.js";
import { Cliente } from "../../domain/Cliente.js";
import {
  CreateClienteData,
  IClienteRepository,
  UpdateClienteData,
} from "../../domain/IClienteRepository.js";

export class PrismaClienteRepository implements IClienteRepository {
  async create(data: CreateClienteData): Promise<Cliente> {
    return prisma.cliente.create({ data });
  }

  async findAll(): Promise<Cliente[]> {
    return prisma.cliente.findMany({ orderBy: { nome: "asc" } });
  }

  async findById(id: number): Promise<Cliente | null> {
    return prisma.cliente.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateClienteData): Promise<Cliente> {
    return prisma.cliente.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prisma.cliente.delete({ where: { id } });
  }
}
