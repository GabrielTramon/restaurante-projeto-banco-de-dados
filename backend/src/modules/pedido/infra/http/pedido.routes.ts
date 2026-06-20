import { Router } from "express";
import { PrismaPedidoRepository } from "../repositories/PrismaPedidoRepository.js";
import { PrismaProdutoRepository } from "../../../produto/infra/repositories/PrismaProdutoRepository.js";
import { CreatePedidoUseCase } from "../../application/CreatePedidoUseCase.js";
import { ListPedidosUseCase } from "../../application/ListPedidosUseCase.js";
import { GetPedidoByIdUseCase } from "../../application/GetPedidoByIdUseCase.js";
import { UpdatePedidoStatusUseCase } from "../../application/UpdatePedidoStatusUseCase.js";
import { DeletePedidoUseCase } from "../../application/DeletePedidoUseCase.js";
import { PedidoController } from "./PedidoController.js";
import { createPedidoSchema, updateStatusSchema } from "./pedido.schemas.js";
import { validateBody } from "../../../../shared/infra/http/middlewares/validateBody.js";
import { asyncHandler } from "../../../../shared/infra/http/helpers/asyncHandler.js";

const pedidoRepository = new PrismaPedidoRepository();
const produtoRepository = new PrismaProdutoRepository();

const controller = new PedidoController(
  new CreatePedidoUseCase(pedidoRepository, produtoRepository),
  new ListPedidosUseCase(pedidoRepository),
  new GetPedidoByIdUseCase(pedidoRepository),
  new UpdatePedidoStatusUseCase(pedidoRepository),
  new DeletePedidoUseCase(pedidoRepository)
);

const pedidoRoutes = Router();

pedidoRoutes.post("/", validateBody(createPedidoSchema), asyncHandler(controller.create));
pedidoRoutes.get("/", asyncHandler(controller.list));
pedidoRoutes.get("/:id", asyncHandler(controller.show));
pedidoRoutes.patch(
  "/:id/status",
  validateBody(updateStatusSchema),
  asyncHandler(controller.updateStatus)
);
pedidoRoutes.delete("/:id", asyncHandler(controller.remove));

export { pedidoRoutes };
