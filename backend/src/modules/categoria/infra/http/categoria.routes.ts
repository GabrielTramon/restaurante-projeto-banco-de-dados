import { Router } from "express";
import { PrismaCategoriaRepository } from "../repositories/PrismaCategoriaRepository.js";
import { CreateCategoriaUseCase } from "../../application/CreateCategoriaUseCase.js";
import { ListCategoriasUseCase } from "../../application/ListCategoriasUseCase.js";
import { GetCategoriaByIdUseCase } from "../../application/GetCategoriaByIdUseCase.js";
import { UpdateCategoriaUseCase } from "../../application/UpdateCategoriaUseCase.js";
import { DeleteCategoriaUseCase } from "../../application/DeleteCategoriaUseCase.js";
import { CategoriaController } from "./CategoriaController.js";
import {
  createCategoriaSchema,
  updateCategoriaSchema,
} from "./categoria.schemas.js";
import { validateBody } from "../../../../shared/infra/http/middlewares/validateBody.js";
import { asyncHandler } from "../../../../shared/infra/http/helpers/asyncHandler.js";

// Composition root do módulo: instancia repositório, casos de uso e controller.
const categoriaRepository = new PrismaCategoriaRepository();

const controller = new CategoriaController(
  new CreateCategoriaUseCase(categoriaRepository),
  new ListCategoriasUseCase(categoriaRepository),
  new GetCategoriaByIdUseCase(categoriaRepository),
  new UpdateCategoriaUseCase(categoriaRepository),
  new DeleteCategoriaUseCase(categoriaRepository)
);

const categoriaRoutes = Router();

categoriaRoutes.post("/", validateBody(createCategoriaSchema), asyncHandler(controller.create));
categoriaRoutes.get("/", asyncHandler(controller.list));
categoriaRoutes.get("/:id", asyncHandler(controller.show));
categoriaRoutes.put("/:id", validateBody(updateCategoriaSchema), asyncHandler(controller.update));
categoriaRoutes.delete("/:id", asyncHandler(controller.remove));

export { categoriaRoutes };
