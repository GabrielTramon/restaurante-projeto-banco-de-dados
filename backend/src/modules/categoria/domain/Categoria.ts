/** Entidade de domínio Categoria (independente do Prisma/HTTP). */
export interface Categoria {
  id: number;
  nome: string;
  descricao: string | null;
}
