import express from "express";
import cors from "cors";
import { router } from "./routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "API do restaurante rodando 🍽️" });
});

app.use("/api", router);

// O errorHandler deve ser o último middleware registrado.
app.use(errorHandler);

export { app };
