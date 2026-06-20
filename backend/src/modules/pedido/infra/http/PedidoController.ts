import { Request, Response } from "express";
import { CreatePedidoUseCase } from "../../application/CreatePedidoUseCase.js";
import { ListPedidosUseCase } from "../../application/ListPedidosUseCase.js";
import { GetPedidoByIdUseCase } from "../../application/GetPedidoByIdUseCase.js";
import { UpdatePedidoStatusUseCase } from "../../application/UpdatePedidoStatusUseCase.js";
import { DeletePedidoUseCase } from "../../application/DeletePedidoUseCase.js";

export class PedidoController {
  constructor(
    private readonly createPedido: CreatePedidoUseCase,
    private readonly listPedidos: ListPedidosUseCase,
    private readonly getPedidoById: GetPedidoByIdUseCase,
    private readonly updatePedidoStatus: UpdatePedidoStatusUseCase,
    private readonly deletePedido: DeletePedidoUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const pedido = await this.createPedido.execute(req.body);
    return res.status(201).json(pedido);
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const pedidos = await this.listPedidos.execute();
    return res.json(pedidos);
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const pedido = await this.getPedidoById.execute(Number(req.params.id));
    return res.json(pedido);
  };

  updateStatus = async (req: Request, res: Response): Promise<Response> => {
    const pedido = await this.updatePedidoStatus.execute(
      Number(req.params.id),
      req.body.status
    );
    return res.json(pedido);
  };

  remove = async (req: Request, res: Response): Promise<Response> => {
    await this.deletePedido.execute(Number(req.params.id));
    return res.status(204).send();
  };
}
