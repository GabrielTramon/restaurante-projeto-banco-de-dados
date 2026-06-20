import { Request, Response } from "express";
import { CreateClienteUseCase } from "../../application/CreateClienteUseCase.js";
import { ListClientesUseCase } from "../../application/ListClientesUseCase.js";
import { GetClienteByIdUseCase } from "../../application/GetClienteByIdUseCase.js";
import { UpdateClienteUseCase } from "../../application/UpdateClienteUseCase.js";
import { DeleteClienteUseCase } from "../../application/DeleteClienteUseCase.js";

export class ClienteController {
  constructor(
    private readonly createCliente: CreateClienteUseCase,
    private readonly listClientes: ListClientesUseCase,
    private readonly getClienteById: GetClienteByIdUseCase,
    private readonly updateCliente: UpdateClienteUseCase,
    private readonly deleteCliente: DeleteClienteUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const cliente = await this.createCliente.execute(req.body);
    return res.status(201).json(cliente);
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const clientes = await this.listClientes.execute();
    return res.json(clientes);
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const cliente = await this.getClienteById.execute(Number(req.params.id));
    return res.json(cliente);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const cliente = await this.updateCliente.execute(
      Number(req.params.id),
      req.body
    );
    return res.json(cliente);
  };

  remove = async (req: Request, res: Response): Promise<Response> => {
    await this.deleteCliente.execute(Number(req.params.id));
    return res.status(204).send();
  };
}
