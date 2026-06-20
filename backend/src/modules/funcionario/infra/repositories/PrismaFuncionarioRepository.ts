import { Funcionario as PrismaFuncionario } from "@prisma/client";
import { prisma } from "../../../../shared/infra/prisma/client.js";
import { Funcionario } from "../../domain/Funcionario.js";
import {
  CreateFuncionarioData,
  IFuncionarioRepository,
  UpdateFuncionarioData,
} from "../../domain/IFuncionarioRepository.js";

/** Converte o registro do Prisma (salario: Decimal) na entidade de domínio. */
function toDomain(funcionario: PrismaFuncionario): Funcionario {
  return {
    id: funcionario.id,
    nome: funcionario.nome,
    cargo: funcionario.cargo,
    telefone: funcionario.telefone,
    dataAdmissao: funcionario.dataAdmissao,
    salario: Number(funcionario.salario),
  };
}

export class PrismaFuncionarioRepository implements IFuncionarioRepository {
  async create(data: CreateFuncionarioData): Promise<Funcionario> {
    const funcionario = await prisma.funcionario.create({ data });
    return toDomain(funcionario);
  }

  async findAll(): Promise<Funcionario[]> {
    const funcionarios = await prisma.funcionario.findMany({
      orderBy: { nome: "asc" },
    });
    return funcionarios.map(toDomain);
  }

  async findById(id: number): Promise<Funcionario | null> {
    const funcionario = await prisma.funcionario.findUnique({ where: { id } });
    return funcionario ? toDomain(funcionario) : null;
  }

  async update(id: number, data: UpdateFuncionarioData): Promise<Funcionario> {
    const funcionario = await prisma.funcionario.update({ where: { id }, data });
    return toDomain(funcionario);
  }

  async delete(id: number): Promise<void> {
    await prisma.funcionario.delete({ where: { id } });
  }
}
