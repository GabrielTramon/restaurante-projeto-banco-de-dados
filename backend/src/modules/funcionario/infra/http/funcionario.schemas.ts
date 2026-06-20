import { z } from "zod";

export const createFuncionarioSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório.").max(150),
  cargo: z.string().trim().min(1, "Cargo é obrigatório.").max(100),
  telefone: z.string().trim().max(20).nullish(),
  dataAdmissao: z.coerce.date().optional(),
  salario: z.number("Salário deve ser um número.").nonnegative("Salário não pode ser negativo."),
});

export const updateFuncionarioSchema = createFuncionarioSchema.partial();
