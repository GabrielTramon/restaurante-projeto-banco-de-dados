import { Funcionario } from "../domain/Funcionario.js";
import { IFuncionarioRepository } from "../domain/IFuncionarioRepository.js";

export class ListFuncionariosUseCase {
  constructor(private readonly funcionarioRepository: IFuncionarioRepository) {}

  async execute(): Promise<Funcionario[]> {
    return this.funcionarioRepository.findAll();
  }
}
