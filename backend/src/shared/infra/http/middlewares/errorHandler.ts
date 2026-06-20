import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../../../errors/AppError.js";

/**
 * Middleware central de tratamento de erros. Converte erros conhecidos
 * (AppError e erros do Prisma) em respostas HTTP adequadas e esconde
 * detalhes internos em erros inesperados (500).
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res
          .status(409)
          .json({ error: "Já existe um registro com esse valor único." });
      case "P2025":
        return res.status(404).json({ error: "Registro não encontrado." });
      case "P2003":
        return res
          .status(400)
          .json({ error: "Referência inválida: a entidade relacionada não existe." });
    }
  }

  console.error(err);
  return res.status(500).json({ error: "Erro interno do servidor." });
};
