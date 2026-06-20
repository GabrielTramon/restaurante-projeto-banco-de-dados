/**
 * Erro base da aplicação. Carrega o status HTTP e detalhes opcionais.
 * Erros que estendem AppError são tratados pelo errorHandler e viram
 * respostas controladas (não 500).
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
