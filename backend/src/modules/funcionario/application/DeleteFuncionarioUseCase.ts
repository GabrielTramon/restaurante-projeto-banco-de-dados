import { IFuncionarioRepository } from "../domain/IFuncionarioRepository.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class DeleteFuncionarioUseCase {
  constructor(private readonly funcionarioRepository: IFuncionarioRepository) {}

  async execute(id: number): Promise<void> {
    const existente = await this.funcionarioRepository.findById(id);
    if (!existente) {
      throw new NotFoundError("Funcionário");
    }
    await this.funcionarioRepository.delete(id);
  }
}
