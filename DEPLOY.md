# Deploy (Vercel + Neon)

A aplicação é um monorepo com **frontend** (Next.js) e **backend** (Express).
Cada um vira **um projeto na Vercel** (apontando para o mesmo repositório, mas
com _Root Directory_ diferente). O banco PostgreSQL fica no **Neon**.

```
Frontend (Next.js)  ─▶ Vercel  (Root Directory = frontend)
Backend  (Express)  ─▶ Vercel  (Root Directory = backend, serverless)
Banco    (Postgres) ─▶ Neon
```

---

## 1. Banco de dados no Neon

1. Crie um projeto em [neon.tech](https://neon.tech) e copie as connection strings
   (no painel do Neon, em **Connection Details**):
   - **Pooled** (tem `-pooler` no host) → usada no runtime da Vercel.
   - **Direct** (sem `-pooler`) → usada para criar/migrar as tabelas.
   Ambas já vêm com `?sslmode=require`.

2. Crie as tabelas no Neon e popule (rodando **localmente**, apontando para o Neon):

   ```powershell
   # No backend/.env, troque temporariamente DATABASE_URL pela conexão DIRECT do Neon
   $env:NODE_OPTIONS="--use-system-ca"   # se a sua rede exigir
   yarn prisma migrate deploy            # aplica a migration existente -> cria as tabelas
   yarn db:seed                          # (opcional) popula com dados de exemplo
   ```

   > Alternativa sem rodar local: abra o **SQL Editor** do Neon e cole o conteúdo de
   > `backend/prisma/migrations/*/migration.sql`.

---

## 2. Backend na Vercel (API serverless)

1. Em vercel.com, **New Project** → importe este repositório.
2. **Settings → General → Root Directory = `backend`**.
3. **Framework Preset = Other** (a Vercel deve detectar sozinha).
4. **Settings → Environment Variables**:
   - `DATABASE_URL` = connection string **Pooled** do Neon.
5. **Deploy.** A URL final será algo como `https://seu-backend.vercel.app`.
6. Teste abrindo `https://seu-backend.vercel.app/api/produtos` → deve devolver JSON.

O `backend/vercel.json` já cuida do build (`prisma generate && tsc`) e de rotear
todas as requisições para a função serverless (`api/index.js`), que reaproveita o
app Express. O Prisma já está configurado com o binary target do Linux da Vercel.

---

## 3. Frontend na Vercel (painel)

1. **New Project** → importe o **mesmo repositório** (cria um segundo projeto).
2. **Settings → General → Root Directory = `frontend`** (a Vercel detecta Next.js).
3. **Settings → Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = a URL do backend (ex.: `https://seu-backend.vercel.app`).
4. **Deploy.**

> O projeto que estava dando erro pode ser reaproveitado para um dos dois — basta
> ajustar o _Root Directory_ correto e refazer o deploy.

---

## Observações

- O CORS do backend já está liberado para o frontend.
- Sempre que mudar o `NEXT_PUBLIC_API_URL`, faça **Redeploy** do frontend (é lida no build).
- O dashboard usa dados de demonstração; as telas de CRUD e Pedidos usam a API real.
