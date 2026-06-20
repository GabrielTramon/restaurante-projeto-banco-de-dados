import { z } from "zod";

export const createProdutoSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório.").max(150),
  descricao: z.string().trim().max(2000).nullish(),
  preco: z.number("Preço deve ser um número.").nonnegative("Preço não pode ser negativo."),
  idCategoria: z.number().int().positive("idCategoria deve ser um inteiro positivo."),
  disponivel: z.boolean().optional(),
});

export const updateProdutoSchema = createProdutoSchema.partial();
