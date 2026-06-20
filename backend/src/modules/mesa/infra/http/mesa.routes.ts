import { Router } from "express";
import { PrismaMesaRepository } from "../repositories/PrismaMesaRepository.js";
import { CreateMesaUseCase } from "../../application/CreateMesaUseCase.js";
import { ListMesasUseCase } from "../../application/ListMesasUseCase.js";
import { GetMesaByIdUseCase } from "../../application/GetMesaByIdUseCase.js";
import { UpdateMesaUseCase } from "../../application/UpdateMesaUseCase.js";
import { DeleteMesaUseCase } from "../../application/DeleteMesaUseCase.js";
import { MesaController } from "./MesaController.js";
import { createMesaSchema, updateMesaSchema } from "./mesa.schemas.js";
import { validateBody } from "../../../../shared/infra/http/middlewares/validateBody.js";
import { asyncHandler } from "../../../../shared/infra/http/helpers/asyncHandler.js";

const mesaRepository = new PrismaMesaRepository();

const controller = new MesaController(
  new CreateMesaUseCase(mesaRepository),
  new ListMesasUseCase(mesaRepository),
  new GetMesaByIdUseCase(mesaRepository),
  new UpdateMesaUseCase(mesaRepository),
  new DeleteMesaUseCase(mesaRepository)
);

const mesaRoutes = Router();

mesaRoutes.post("/", validateBody(createMesaSchema), asyncHandler(controller.create));
mesaRoutes.get("/", asyncHandler(controller.list));
mesaRoutes.get("/:id", asyncHandler(controller.show));
mesaRoutes.put("/:id", validateBody(updateMesaSchema), asyncHandler(controller.update));
mesaRoutes.delete("/:id", asyncHandler(controller.remove));

export { mesaRoutes };
