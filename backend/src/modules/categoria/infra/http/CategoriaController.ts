import { Request, Response } from "express";
import { CreateCategoriaUseCase } from "../../application/CreateCategoriaUseCase.js";
import { ListCategoriasUseCase } from "../../application/ListCategoriasUseCase.js";
import { GetCategoriaByIdUseCase } from "../../application/GetCategoriaByIdUseCase.js";
import { UpdateCategoriaUseCase } from "../../application/UpdateCategoriaUseCase.js";
import { DeleteCategoriaUseCase } from "../../application/DeleteCategoriaUseCase.js";

/**
 * Adapta o HTTP para os casos de uso. Não contém regra de negócio:
 * apenas lê a requisição, chama o caso de uso e formata a resposta.
 */
export class CategoriaController {
  constructor(
    private readonly createCategoria: CreateCategoriaUseCase,
    private readonly listCategorias: ListCategoriasUseCase,
    private readonly getCategoriaById: GetCategoriaByIdUseCase,
    private readonly updateCategoria: UpdateCategoriaUseCase,
    private readonly deleteCategoria: DeleteCategoriaUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const categoria = await this.createCategoria.execute(req.body);
    return res.status(201).json(categoria);
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const categorias = await this.listCategorias.execute();
    return res.json(categorias);
  };

  show = async (req: Request, res: Response): Promise<Response> => {
    const categoria = await this.getCategoriaById.execute(Number(req.params.id));
    return res.json(categoria);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const categoria = await this.updateCategoria.execute(
      Number(req.params.id),
      req.body
    );
    return res.json(categoria);
  };

  remove = async (req: Request, res: Response): Promise<Response> => {
    await this.deleteCategoria.execute(Number(req.params.id));
    return res.status(204).send();
  };
}
