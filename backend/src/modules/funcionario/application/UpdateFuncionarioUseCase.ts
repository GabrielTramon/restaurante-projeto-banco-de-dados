import { Funcionario } from "../domain/Funcionario.js";
import {
  IFuncionarioRepository,
  UpdateFuncionarioData,
} from "../domain/IFuncionarioRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class UpdateFuncionarioUseCase {
  constructor(private readonly funcionarioRepository: IFuncionarioRepository) {}

  async execute(id: number, data: UpdateFuncionarioData): Promise<Funcionario> {
    const existente = await this.funcionarioRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Funcionário");
    }
    return this.funcionarioRepository.update(id, data);
  }
}
