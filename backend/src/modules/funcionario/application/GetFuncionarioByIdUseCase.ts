import { Funcionario } from "../domain/Funcionario.js";
import { IFuncionarioRepository } from "../domain/IFuncionarioRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class GetFuncionarioByIdUseCase {
  constructor(private readonly funcionarioRepository: IFuncionarioRepository) {}

  async execute(id: number): Promise<Funcionario> {
    const funcionario = await this.funcionarioRepository.findById(id);
    if (!funcionario) {
      throw new NotFoundError("Funcionário");
    }
    return funcionario;
  }
}
