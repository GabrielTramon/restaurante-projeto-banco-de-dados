import { z } from "zod";

export const createClienteSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório.").max(150),
  email: z.email("E-mail inválido.").max(200).nullish(),
  telefone: z.string().trim().max(20).nullish(),
});

export const updateClienteSchema = createClienteSchema.partial();
