import { AppError } from "./AppError.js";

/** Conflito de dados, ex.: violação de unicidade (HTTP 409). */
export class ConflictError extends AppError {
  constructor(message = "Já existe um registro com esses dados.") {
    super(message, 409);
  }
}
