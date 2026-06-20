import { Request, Response } from "express";
import { CreateFuncionarioUseCase } from "../../application/CreateFuncionarioUseCase.js";
import { ListFuncionariosUseCase } from "../../application/ListFuncionariosUseCase.js";
import { GetFuncionarioByIdUseCase } from "../../application/GetFuncionarioByIdUseCase.js";
import { UpdateFuncionarioUseCase } from "../../application/UpdateFuncionarioUseCase.js";
import { DeleteFuncionarioUseCase } from "../../application/DeleteFuncionarioUseCase.js";

export class FuncionarioController {
  constructor(
    private readonly createFuncionario: CreateFuncionarioUseCase,
    private readonly listFuncionarios: ListFuncionariosUseCase,
    private readonly getFuncionarioById: GetFuncionarioByIdUseCase,
    private readonly updateFuncionario: UpdateFuncionarioUseCase,
    private readonly deleteFuncionario: DeleteFuncionarioUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const funcionario = await this.createFuncionario.execute(req.body);
    return res.status(201).json(funcionario);
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const funcionarios = await this.listFuncionarios.execute();
    return res.json(funcionarios);
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const funcionario = await this.getFuncionarioById.execute(Number(req.params.id));
    return res.json(funcionario);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const funcionario = await this.updateFuncionario.execute(
      Number(req.params.id),
      req.body
    );
    return res.json(funcionario);
  };

  remove = async (req: Request, res: Response): Promise<Response> => {
    await this.deleteFuncionario.execute(Number(req.params.id));
    return res.status(204).send();
  };
}
