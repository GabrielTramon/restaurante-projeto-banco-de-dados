import { Categoria } from "./Categoria.js";

export interface CreateCategoriaData {
  nome: string;
  descricao?: string | null;
}

export interface UpdateCategoriaData {
  nome?: string;
  descricao?: string | null;
}

/**
 * Contrato do repositório de Categoria. A camada de aplicação depende
 * desta abstração, não da implementação concreta (Prisma).
 */
export interface ICategoriaRepository {
  create(data: CreateCategoriaData): Promise<Categoria>;
  findAll(): Promise<Categoria[]>;
  findById(id: number): Promise<Categoria | null>;
  update(id: number, data: UpdateCategoriaData): Promise<Categoria>;
  delete(id: number): Promise<void>;
}
