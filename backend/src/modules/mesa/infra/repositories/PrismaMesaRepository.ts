import { prisma } from "../../../../shared/infra/prisma/client.js";
import { Mesa } from "../../domain/Mesa.js";
import {
  CreateMesaData,
  IMesaRepository,
  UpdateMesaData,
} from "../../domain/IMesaRepository.js";

export class PrismaMesaRepository implements IMesaRepository {
  async create(data: CreateMesaData): Promise<Mesa> {
    return prisma.mesa.create({ data });
  }

  async findAll(): Promise<Mesa[]> {
    return prisma.mesa.findMany({ orderBy: { numero: "asc" } });
  }

  async findById(id: number): Promise<Mesa | null> {
    return prisma.mesa.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateMesaData): Promise<Mesa> {
    return prisma.mesa.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prisma.mesa.delete({ where: { id } });
  }
}
