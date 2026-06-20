import { Router } from "express";
import { PrismaProdutoRepository } from "../repositories/PrismaProdutoRepository.js";
import { PrismaCategoriaRepository } from "../../../categoria/infra/repositories/PrismaCategoriaRepository.js";
import { CreateProdutoUseCase } from "../../application/CreateProdutoUseCase.js";
import { ListProdutosUseCase } from "../../application/ListProdutosUseCase.js";
import { GetProdutoByIdUseCase } from "../../application/GetProdutoByIdUseCase.js";
import { UpdateProdutoUseCase } from "../../application/UpdateProdutoUseCase.js";
import { DeleteProdutoUseCase } from "../../application/DeleteProdutoUseCase.js";
import { ProdutoController } from "./ProdutoController.js";
import { createProdutoSchema, updateProdutoSchema } from "./produto.schemas.js";
import { validateBody } from "../../../../shared/infra/http/middlewares/validateBody.js";
import { asyncHandler } from "../../../../shared/infra/http/helpers/asyncHandler.js";

// Composition root do módulo Produto.
const produtoRepository = new PrismaProdutoRepository();
const categoriaRepository = new PrismaCategoriaRepository();

const controller = new ProdutoController(
  new CreateProdutoUseCase(produtoRepository, categoriaRepository),
  new ListProdutosUseCase(produtoRepository),
  new GetProdutoByIdUseCase(produtoRepository),
  new UpdateProdutoUseCase(produtoRepository, categoriaRepository),
  new DeleteProdutoUseCase(produtoRepository)
);

const produtoRoutes = Router();

produtoRoutes.post("/", validateBody(createProdutoSchema), asyncHandler(controller.create));
produtoRoutes.get("/", asyncHandler(controller.list));
produtoRoutes.get("/:id", asyncHandler(controller.show));
produtoRoutes.put("/:id", validateBody(updateProdutoSchema), asyncHandler(controller.update));
produtoRoutes.delete("/:id", asyncHandler(controller.remove));

export { produtoRoutes };
