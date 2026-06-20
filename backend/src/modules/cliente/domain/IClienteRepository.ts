import { Cliente } from "./Cliente.js";

export interface CreateClienteData {
  nome: string;
  email?: string | null;
  telefone?: string | null;
}

export interface UpdateClienteData {
  nome?: string;
  email?: string | null;
  telefone?: string | null;
}

export interface IClienteRepository {
  create(data: CreateClienteData): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findById(id: number): Promise<Cliente | null>;
  update(id: number, data: UpdateClienteData): Promise<Cliente>;
  delete(id: number): Promise<void>;
}
