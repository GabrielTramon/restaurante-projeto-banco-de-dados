import { Router } from "express";
import { categoriaRoutes } from "../../../modules/categoria/infra/http/categoria.routes.js";
import { produtoRoutes } from "../../../modules/produto/infra/http/produto.routes.js";
import { funcionarioRoutes } from "../../../modules/funcionario/infra/http/funcionario.routes.js";
import { clienteRoutes } from "../../../modules/cliente/infra/http/cliente.routes.js";
import { mesaRoutes } from "../../../modules/mesa/infra/http/mesa.routes.js";
import { pedidoRoutes } from "../../../modules/pedido/infra/http/pedido.routes.js";

/** Agrega as rotas de todos os módulos sob o prefixo /api. */
const router = Router();

router.use("/categorias", categoriaRoutes);
router.use("/produtos", produtoRoutes);
router.use("/funcionarios", funcionarioRoutes);
router.use("/clientes", clienteRoutes);
router.use("/mesas", mesaRoutes);
router.use("/pedidos", pedidoRoutes);

export { router };
