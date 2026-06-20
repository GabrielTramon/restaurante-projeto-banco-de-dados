import { Produto } from "./Produto.js";

export interface CreateProdutoData {
  nome: string;
  descricao?: string | null;
  preco: number;
  idCategoria: number;
  disponivel?: boolean;
}

export interface UpdateProdutoData {
  nome?: string;
  descricao?: string | null;
  preco?: number;
  idCategoria?: number;
  disponivel?: boolean;
}

export interface IProdutoRepository {
  create(data: CreateProdutoData): Promise<Produto>;
  findAll(): Promise<Produto[]>;
  findById(id: number): Promise<Produto | null>;
  update(id: number, data: UpdateProdutoData): Promise<Produto>;
  delete(id: number): Promise<void>;
}
