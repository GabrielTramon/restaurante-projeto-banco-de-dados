import { Mesa, MesaStatus } from "./Mesa.js";

export interface CreateMesaData {
  numero: number;
  capacidade: number;
  status?: MesaStatus;
}

export interface UpdateMesaData {
  numero?: number;
  capacidade?: number;
  status?: MesaStatus;
}

export interface IMesaRepository {
  create(data: CreateMesaData): Promise<Mesa>;
  findAll(): Promise<Mesa[]>;
  findById(id: number): Promise<Mesa | null>;
  update(id: number, data: UpdateMesaData): Promise<Mesa>;
  delete(id: number): Promise<void>;
}
