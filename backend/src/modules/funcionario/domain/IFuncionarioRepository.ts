import { Funcionario } from "./Funcionario.js";

export interface CreateFuncionarioData {
  nome: string;
  cargo: string;
  telefone?: string | null;
  dataAdmissao?: Date;
  salario: number;
}

export interface UpdateFuncionarioData {
  nome?: string;
  cargo?: string;
  telefone?: string | null;
  dataAdmissao?: Date;
  salario?: number;
}

export interface IFuncionarioRepository {
  create(data: CreateFuncionarioData): Promise<Funcionario>;
  findAll(): Promise<Funcionario[]>;
  findById(id: number): Promise<Funcionario | null>;
  update(id: number, data: UpdateFuncionarioData): Promise<Funcionario>;
  delete(id: number): Promise<void>;
}
