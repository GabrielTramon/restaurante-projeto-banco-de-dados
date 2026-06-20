import { Cliente } from "../domain/Cliente.js";
import {
  CreateClienteData,
  IClienteRepository,
} from "../domain/IClienteRepository.js";

export class CreateClienteUseCase {
  constructor(private readonly clienteRepository: IClienteRepository) {}

  async execute(data: CreateClienteData): Promise<Cliente> {
    // A unicidade do e-mail é garantida pelo banco (constraint UNIQUE);
    // uma violação é convertida em 409 pelo errorHandler.
    return this.clienteRepository.create(data);
  }
}
