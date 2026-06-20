import { AppError } from "./AppError.js";

/** Dados de entrada inválidos (HTTP 422). */
export class ValidationError extends AppError {
  constructor(message = "Dados inválidos.", details?: unknown) {
    super(message, 422, details);
  }
}
