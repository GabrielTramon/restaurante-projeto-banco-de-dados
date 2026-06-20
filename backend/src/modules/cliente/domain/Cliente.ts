/** Entidade de domínio Cliente. */
export interface Cliente {
  id: number;
  nome: string;
  email: string | null;
  telefone: string | null;
}
