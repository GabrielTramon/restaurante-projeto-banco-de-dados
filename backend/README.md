# Backend — API do Restaurante

API REST construída com **Node.js + TypeScript + Express + Prisma + PostgreSQL**.

## Pré-requisitos

- Node.js 18+ (testado com 22)
- Yarn 1.x
- Um banco PostgreSQL acessível

## Configuração

1. Instale as dependências:

   ```bash
   yarn install
   ```

2. Copie o arquivo de ambiente e ajuste a conexão do banco:

   ```bash
   cp .env.example .env
   ```

   Edite `DATABASE_URL` no `.env` com seu usuário, senha, host, porta e nome do banco.

3. Crie as tabelas no banco (gera a primeira migration e o Prisma Client):

   ```bash
   yarn prisma:migrate
   ```

4. (Opcional) Popule com dados de exemplo:

   ```bash
   yarn db:seed
   ```

## Rodando

```bash
yarn dev      # desenvolvimento (hot reload com tsx)
yarn build    # compila para dist/
yarn start    # roda o build de produção
```

A API sobe em `http://localhost:3333` (configurável via `PORT` no `.env`).

## Rotas de exemplo

| Método | Rota                  | Descrição                  |
| ------ | --------------------- | -------------------------- |
| GET    | `/`                   | Healthcheck                |
| GET    | `/api/categorias`     | Lista categorias           |
| GET    | `/api/categorias/:id` | Busca categoria por id     |
| POST   | `/api/categorias`     | Cria categoria             |
| PUT    | `/api/categorias/:id` | Atualiza categoria         |
| DELETE | `/api/categorias/:id` | Remove categoria           |
| GET    | `/api/produtos`       | Lista produtos             |
| GET    | `/api/produtos/:id`   | Busca produto por id       |
| POST   | `/api/produtos`       | Cria produto               |
| PUT    | `/api/produtos/:id`   | Atualiza produto           |
| DELETE | `/api/produtos/:id`   | Remove produto             |

Cada uma das entidades abaixo expõe o CRUD completo
(`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`):

| Recurso              | Observações                              |
| -------------------- | ---------------------------------------- |
| `/api/categorias`    | —                                        |
| `/api/produtos`      | valida se a categoria (FK) existe        |
| `/api/funcionarios`  | `salario` numérico, `dataAdmissao` opcional |
| `/api/clientes`      | `email` único e validado                 |
| `/api/mesas`         | `status`: disponivel \| ocupada \| reservada |
| `/api/pedidos`       | criação com itens (transação) e total calculado no servidor |

**Pedidos** expõem, além do CRUD de leitura/exclusão:

| Método | Rota                       | Descrição                                   |
| ------ | -------------------------- | ------------------------------------------- |
| GET    | `/api/pedidos`             | Lista pedidos com cliente, mesa e itens     |
| GET    | `/api/pedidos/:id`         | Detalha um pedido                           |
| POST   | `/api/pedidos`             | Cria pedido + itens (total calculado aqui)  |
| PATCH  | `/api/pedidos/:id/status`  | Atualiza o status do pedido                 |
| DELETE | `/api/pedidos/:id`         | Remove o pedido (itens em cascata)          |

> CRUDs implementados: **Categoria, Produto, Funcionario, Cliente, Mesa e
> Pedido** (este com itens). Faltam apenas Reserva e Pagamento, que seguem o
> mesmo padrão de Clean Architecture.

## Comandos úteis do Prisma

```bash
yarn prisma:generate   # regenera o Prisma Client após mudar o schema
yarn prisma:migrate    # cria/aplica migrations em desenvolvimento
yarn prisma:studio     # abre o Prisma Studio (UI do banco)
```

## Arquitetura (Clean Architecture)

Organização modular por feature. Cada módulo tem três camadas, com as
dependências sempre apontando para dentro (HTTP → casos de uso → domínio):

```
src/
├── server.ts                       # ponto de entrada
├── shared/                         # núcleo compartilhado
│   ├── errors/                     # AppError, NotFoundError, ConflictError, ValidationError
│   └── infra/
│       ├── prisma/client.ts        # singleton do Prisma Client
│       └── http/
│           ├── app.ts              # configuração do Express
│           ├── routes.ts           # agrega as rotas dos módulos
│           ├── helpers/asyncHandler.ts
│           └── middlewares/        # validateBody (Zod) + errorHandler
└── modules/
    └── <entidade>/
        ├── domain/                 # Entidade + interface do repositório (sem framework)
        ├── application/            # Casos de uso (1 por operação do CRUD)
        └── infra/
            ├── repositories/       # Implementação Prisma do repositório
            └── http/               # Controller, rotas (composition root) e schemas Zod
```

**Princípios aplicados:**
- O domínio e os casos de uso não conhecem Express nem Prisma (dependem só de interfaces).
- Inversão de dependência: casos de uso recebem o repositório via construtor.
- Uma responsabilidade por arquivo (um caso de uso por operação).
- Validação na borda (Zod) e tratamento de erros centralizado (`errorHandler`).
