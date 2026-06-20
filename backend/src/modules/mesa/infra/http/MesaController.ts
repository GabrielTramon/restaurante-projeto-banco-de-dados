import { Request, Response } from "express";
import { CreateMesaUseCase } from "../../application/CreateMesaUseCase.js";
import { ListMesasUseCase } from "../../application/ListMesasUseCase.js";
import { GetMesaByIdUseCase } from "../../application/GetMesaByIdUseCase.js";
import { UpdateMesaUseCase } from "../../application/UpdateMesaUseCase.js";
import { DeleteMesaUseCase } from "../../application/DeleteMesaUseCase.js";

export class MesaController {
  constructor(
    private readonly createMesa: CreateMesaUseCase,
    private readonly listMesas: ListMesasUseCase,
    private readonly getMesaById: GetMesaByIdUseCase,
    private readonly updateMesa: UpdateMesaUseCase,
    private readonly deleteMesa: DeleteMesaUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const mesa = await this.createMesa.execute(req.body);
    return res.status(201).json(mesa);
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const mesas = await this.listMesas.execute();
    return res.json(mesas);
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const mesa = await this.getMesaById.execute(Number(req.params.id));
    return res.json(mesa);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const mesa = await this.updateMesa.execute(Number(req.params.id), req.body);
    return res.json(mesa);
  };

  remove = async (req: Request, res: Response): Promise<Response> => {
    await this.deleteMesa.execute(Number(req.params.id));
    return res.status(204).send();
  };
}
