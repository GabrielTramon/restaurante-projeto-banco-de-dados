import { z } from "zod";

export const createCategoriaSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório.").max(100),
  descricao: z.string().trim().max(1000).nullish(),
});

export const updateCategoriaSchema = createCategoriaSchema.partial();
