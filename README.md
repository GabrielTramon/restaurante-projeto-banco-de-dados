# Restaurante — Projeto Banco de Dados

Monorepo (um único repositório) com **backend** e **frontend**.

| Pasta       | Stack                                                              |
| ----------- | ----------------------------------------------------------------- |
| `backend/`  | Node.js · TypeScript · Express · Prisma · PostgreSQL · Yarn        |
| `frontend/` | Next.js 16 · TypeScript · TailwindCSS v4                           |

## Pré-requisitos

- [Node.js](https://nodejs.org) 18+ (testado com 22)
- [Yarn](https://classic.yarnpkg.com) 1.x
- Um banco **PostgreSQL** rodando (local ou remoto)

> **Nota sobre rede:** se a instalação do Prisma ou o build do Next falhar com erro
> de certificado TLS (`unable to verify the first certificate`), rode os comandos com
> `NODE_OPTIONS=--use-system-ca` para usar a loja de certificados do Windows.
> No PowerShell: `$env:NODE_OPTIONS="--use-system-ca"` antes do comando.

## Instalação

Na raiz do projeto:

```bash
yarn install:all
```

Isso instala as dependências do `backend` e do `frontend`.

### Configurar o banco (backend)

1. Crie o `.env` do backend a partir do exemplo e ajuste a conexão:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Edite `DATABASE_URL` com seu usuário, senha, host, porta e nome do banco PostgreSQL.

2. Crie as tabelas e gere o Prisma Client:

   ```bash
   yarn prisma:migrate
   ```

3. (Opcional) Popule com dados de exemplo:

   ```bash
   yarn db:seed
   ```

### Configurar o frontend

```bash
cp frontend/.env.local.example frontend/.env.local
```

(Aponta `NEXT_PUBLIC_API_URL` para a API do backend.)

## Rodando em desenvolvimento

Em dois terminais (ou use o que preferir):

```bash
yarn dev:backend    # API em http://localhost:3333
yarn dev:frontend   # App em http://localhost:3000
```

## Scripts da raiz

| Script                 | O que faz                                  |
| ---------------------- | ------------------------------------------ |
| `yarn install:all`     | Instala backend + frontend                 |
| `yarn dev:backend`     | Sobe a API em modo dev                     |
| `yarn dev:frontend`    | Sobe o Next em modo dev                    |
| `yarn build:backend`   | Compila o backend (`dist/`)                |
| `yarn build:frontend`  | Build de produção do Next                  |
| `yarn prisma:migrate`  | Cria/aplica migrations                     |
| `yarn db:seed`         | Popula o banco com dados de exemplo        |

Veja [backend/README.md](backend/README.md) para detalhes da API e rotas.
