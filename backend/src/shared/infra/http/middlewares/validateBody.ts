import { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";
import { ValidationError } from "../../../errors/ValidationError.js";

/**
 * Valida (e sanitiza) o corpo da requisição contra um schema Zod.
 * Em caso de falha, lança ValidationError com os erros por campo.
 * Em caso de sucesso, substitui req.body pelos dados já parseados.
 */
export const validateBody =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      return next(new ValidationError("Erro de validação.", fieldErrors));
    }
    req.body = result.data;
    next();
  };
