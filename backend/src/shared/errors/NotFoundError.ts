import { AppError } from "./AppError.js";

/** Recurso não encontrado (HTTP 404). */
export class NotFoundError extends AppError {
  constructor(recurso = "Recurso") {
    super(`${recurso} não encontrado(a).`, 404);
  }
}
