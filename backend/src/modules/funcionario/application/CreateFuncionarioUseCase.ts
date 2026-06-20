import { Funcionario } from "../domain/Funcionario.js";
import {
  CreateFuncionarioData,
  IFuncionarioRepository,
} from "../domain/IFuncionarioRepository.js";

export class CreateFuncionarioUseCase {
  constructor(private readonly funcionarioRepository: IFuncionarioRepository) {}

  async execute(data: CreateFuncionarioData): Promise<Funcionario> {
    return this.funcionarioRepository.create(data);
  }
}
