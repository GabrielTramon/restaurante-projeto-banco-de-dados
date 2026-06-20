import { Router } from "express";
import { PrismaClienteRepository } from "../repositories/PrismaClienteRepository.js";
import { CreateClienteUseCase } from "../../application/CreateClienteUseCase.js";
import { ListClientesUseCase } from "../../application/ListClientesUseCase.js";
import { GetClienteByIdUseCase } from "../../application/GetClienteByIdUseCase.js";
import { UpdateClienteUseCase } from "../../application/UpdateClienteUseCase.js";
import { DeleteClienteUseCase } from "../../application/DeleteClienteUseCase.js";
import { ClienteController } from "./ClienteController.js";
import { createClienteSchema, updateClienteSchema } from "./cliente.schemas.js";
import { validateBody } from "../../../../shared/infra/http/middlewares/validateBody.js";
import { asyncHandler } from "../../../../shared/infra/http/helpers/asyncHandler.js";

const clienteRepository = new PrismaClienteRepository();

const controller = new ClienteController(
  new CreateClienteUseCase(clienteRepository),
  new ListClientesUseCase(clienteRepository),
  new GetClienteByIdUseCase(clienteRepository),
  new UpdateClienteUseCase(clienteRepository),
  new DeleteClienteUseCase(clienteRepository)
);

const clienteRoutes = Router();

clienteRoutes.post("/", validateBody(createClienteSchema), asyncHandler(controller.create));
clienteRoutes.get("/", asyncHandler(controller.list));
clienteRoutes.get("/:id", asyncHandler(controller.show));
clienteRoutes.put("/:id", validateBody(updateClienteSchema), asyncHandler(controller.update));
clienteRoutes.delete("/:id", asyncHandler(controller.remove));

export { clienteRoutes };
