// Entrypoint serverless da Vercel.
// Reaproveita o app Express já compilado (dist/) — sem chamar app.listen(),
// pois na Vercel cada requisição invoca esta função.
// O build (vercel.json -> buildCommand) gera o dist/ antes do bundle da função.
import { app } from "../dist/shared/infra/http/app.js";

export default app;
