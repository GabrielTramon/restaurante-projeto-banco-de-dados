import { Request, Response } from "express";
import { CreateProdutoUseCase } from "../../application/CreateProdutoUseCase.js";
import { ListProdutosUseCase } from "../../application/ListProdutosUseCase.js";
import { GetProdutoByIdUseCase } from "../../application/GetProdutoByIdUseCase.js";
import { UpdateProdutoUseCase } from "../../application/UpdateProdutoUseCase.js";
import { DeleteProdutoUseCase } from "../../application/DeleteProdutoUseCase.js";

export class ProdutoController {
  constructor(
    private readonly createProduto: CreateProdutoUseCase,
    private readonly listProdutos: ListProdutosUseCase,
    private readonly getProdutoById: GetProdutoByIdUseCase,
    private readonly updateProduto: UpdateProdutoUseCase,
    private readonly deleteProduto: DeleteProdutoUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const produto = await this.createProduto.execute(req.body);
    return res.status(201).json(produto);
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const produtos = await this.listProdutos.execute();
    return res.json(produtos);
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const produto = await this.getProdutoById.execute(Number(req.params.id));
    return res.json(produto);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const produto = await this.updateProduto.execute(
      Number(req.params.id),
      req.body
    );
    return res.json(produto);
  };

  remove = async (req: Request, res: Response): Promise<Response> => {
    await this.deleteProduto.execute(Number(req.params.id));
    return res.status(204).send();
  };
}
