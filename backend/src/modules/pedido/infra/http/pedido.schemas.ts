import { z } from "zod";

const statusValues = [
  "aberto",
  "em_preparo",
  "pronto",
  "entregue",
  "cancelado",
] as const;

export const createPedidoSchema = z.object({
  idMesa: z.number().int().positive().nullish(),
  idFuncionario: z.number().int().positive().nullish(),
  idCliente: z.number().int().positive().nullish(),
  itens: z
    .array(
      z.object({
        idProduto: z.number().int().positive(),
        quantidade: z.number().int().positive("Quantidade deve ser maior que zero."),
        observacao: z.string().max(500).nullish(),
      })
    )
    .min(1, "Adicione ao menos um item ao pedido."),
});

export const updateStatusSchema = z.object({
  status: z.enum(statusValues),
});
