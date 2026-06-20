import { Router } from "express";
import { PrismaFuncionarioRepository } from "../repositories/PrismaFuncionarioRepository.js";
import { CreateFuncionarioUseCase } from "../../application/CreateFuncionarioUseCase.js";
import { ListFuncionariosUseCase } from "../../application/ListFuncionariosUseCase.js";
import { GetFuncionarioByIdUseCase } from "../../application/GetFuncionarioByIdUseCase.js";
import { UpdateFuncionarioUseCase } from "../../application/UpdateFuncionarioUseCase.js";
import { DeleteFuncionarioUseCase } from "../../application/DeleteFuncionarioUseCase.js";
import { FuncionarioController } from "./FuncionarioController.js";
import {
  createFuncionarioSchema,
  updateFuncionarioSchema,
} from "./funcionario.schemas.js";
import { validateBody } from "../../../../shared/infra/http/middlewares/validateBody.js";
import { asyncHandler } from "../../../../shared/infra/http/helpers/asyncHandler.js";

const funcionarioRepository = new PrismaFuncionarioRepository();

const controller = new FuncionarioController(
  new CreateFuncionarioUseCase(funcionarioRepository),
  new ListFuncionariosUseCase(funcionarioRepository),
  new GetFuncionarioByIdUseCase(funcionarioRepository),
  new UpdateFuncionarioUseCase(funcionarioRepository),
  new DeleteFuncionarioUseCase(funcionarioRepository)
);

const funcionarioRoutes = Router();

funcionarioRoutes.post("/", validateBody(createFuncionarioSchema), asyncHandler(controller.create));
funcionarioRoutes.get("/", asyncHandler(controller.list));
funcionarioRoutes.get("/:id", asyncHandler(controller.show));
funcionarioRoutes.put("/:id", validateBody(updateFuncionarioSchema), asyncHandler(controller.update));
funcionarioRoutes.delete("/:id", asyncHandler(controller.remove));

export { funcionarioRoutes };
