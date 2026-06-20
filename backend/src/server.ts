import "dotenv/config";
import { app } from "./shared/infra/http/app.js";

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
