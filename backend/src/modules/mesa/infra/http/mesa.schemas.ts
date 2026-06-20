import { z } from "zod";

export const createMesaSchema = z.object({
  numero: z.number().int().positive("Número da mesa deve ser um inteiro positivo."),
  capacidade: z.number().int().positive("Capacidade deve ser maior que zero."),
  status: z.enum(["disponivel", "ocupada", "reservada"]).optional(),
});

export const updateMesaSchema = createMesaSchema.partial();
