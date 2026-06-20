import { NextFunction, Request, Response } from "express";

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

/**
 * Encapsula handlers assíncronos para que erros lançados (ex.: dos casos de
 * uso) sejam encaminhados ao errorHandler. No Express 4 rejeições de Promise
 * não chegam ao middleware de erro automaticamente.
 */
export const asyncHandler =
  (handler: AsyncRouteHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
