import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ----- Helpers de data (equivalentes a NOW() +/- INTERVAL do SQL) -----
const base = Date.now();
const min = (n: number) => new Date(base + n * 60_000); // minutos
const hours = (n: number) => new Date(base + n * 3_600_000); // horas
const days = (n: number) => new Date(base + n * 86_400_000); // dias

async function main() {
  console.log("🌱 Populando o banco do restaurante...");

  // Limpa os dados na ordem segura de FKs (idempotente: pode rodar de novo).
  await prisma.pagamento.deleteMany();
  await prisma.itemPedido.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.mesa.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.funcionario.deleteMany();
  await prisma.categoria.deleteMany();

  // ----------------------------- Categoria -----------------------------
  await prisma.categoria.createMany({
    data: [
      { id: 1, nome: "Entradas", descricao: "Pratos para começar a refeição" },
      { id: 2, nome: "Pratos", descricao: "Pratos principais" },
      { id: 3, nome: "Bebidas", descricao: "Bebidas alcoólicas e não alcoólicas" },
      { id: 4, nome: "Sobremesas", descricao: "Doces e sobremesas" },
    ],
  });

  // ----------------------------- Produto -----------------------------
  await prisma.produto.createMany({
    data: [
      { id: 1, idCategoria: 1, nome: "Bruschetta", descricao: "Pão tostado com tomate e manjericão", preco: 18.0, disponivel: true },
      { id: 2, idCategoria: 1, nome: "Bolinho de Bacalhau", descricao: "Porção com 6 unidades", preco: 24.0, disponivel: true },
      { id: 3, idCategoria: 1, nome: "Carpaccio", descricao: "Fatias de carne crua com alcaparras", preco: 32.0, disponivel: true },
      { id: 4, idCategoria: 1, nome: "Caldo de Feijão", descricao: "Caldo temperado com linguiça", preco: 16.0, disponivel: true },
      { id: 5, idCategoria: 2, nome: "Frango Grelhado", descricao: "Filé de frango com legumes na brasa", preco: 42.0, disponivel: true },
      { id: 6, idCategoria: 2, nome: "Risoto de Camarão", descricao: "Risoto cremoso com camarão fresco", preco: 68.0, disponivel: true },
      { id: 7, idCategoria: 2, nome: "Picanha na Brasa", descricao: "Picanha 300g com farofa e vinagrete", preco: 89.0, disponivel: true },
      { id: 8, idCategoria: 2, nome: "Parmegiana de Frango", descricao: "Frango empanado com molho e queijo", preco: 54.0, disponivel: true },
      { id: 9, idCategoria: 2, nome: "Moqueca de Peixe", descricao: "Peixe cozido no leite de coco e azeite", preco: 72.0, disponivel: true },
      { id: 10, idCategoria: 2, nome: "Macarrão Carbonara", descricao: "Massa com bacon, ovo e queijo parmesão", preco: 48.0, disponivel: true },
      { id: 11, idCategoria: 3, nome: "Suco de Laranja", descricao: "Suco natural 300ml", preco: 12.0, disponivel: true },
      { id: 12, idCategoria: 3, nome: "Água Mineral", descricao: "Garrafa 500ml", preco: 5.0, disponivel: true },
      { id: 13, idCategoria: 3, nome: "Cerveja Artesanal", descricao: "Long neck 355ml", preco: 16.0, disponivel: true },
      { id: 14, idCategoria: 3, nome: "Refrigerante Lata", descricao: "Lata 350ml", preco: 8.0, disponivel: true },
      { id: 15, idCategoria: 3, nome: "Caipirinha", descricao: "Limão, cachaça e açúcar", preco: 22.0, disponivel: true },
      { id: 16, idCategoria: 3, nome: "Vinho Tinto Taça", descricao: "Taça de vinho tinto seco", preco: 28.0, disponivel: true },
      { id: 17, idCategoria: 4, nome: "Pudim de Leite", descricao: "Pudim caseiro com calda de caramelo", preco: 18.0, disponivel: true },
      { id: 18, idCategoria: 4, nome: "Brownie", descricao: "Brownie com sorvete de creme", preco: 22.0, disponivel: true },
      { id: 19, idCategoria: 4, nome: "Mousse de Chocolate", descricao: "Mousse cremoso com raspas de chocolate", preco: 16.0, disponivel: true },
      { id: 20, idCategoria: 4, nome: "Petit Gateau", descricao: "Bolinho quente com sorvete de baunilha", preco: 28.0, disponivel: false },
    ],
  });

  // ----------------------------- Funcionario -----------------------------
  await prisma.funcionario.createMany({
    data: [
      { id: 1, nome: "Carlos Souza", cargo: "Garçom", telefone: "48999110001", dataAdmissao: new Date("2023-01-15"), salario: 1800.0 },
      { id: 2, nome: "Ana Lima", cargo: "Cozinheira", telefone: "48999220002", dataAdmissao: new Date("2022-06-01"), salario: 3200.0 },
      { id: 3, nome: "João Pereira", cargo: "Gerente", telefone: "48999330003", dataAdmissao: new Date("2021-03-10"), salario: 5500.0 },
      { id: 4, nome: "Fernanda Costa", cargo: "Garçonete", telefone: "48999440004", dataAdmissao: new Date("2023-08-20"), salario: 1800.0 },
      { id: 5, nome: "Ricardo Nunes", cargo: "Cozinheiro", telefone: "48999550005", dataAdmissao: new Date("2022-11-05"), salario: 3000.0 },
      { id: 6, nome: "Beatriz Mendes", cargo: "Caixa", telefone: "48999660006", dataAdmissao: new Date("2023-04-18"), salario: 2100.0 },
      { id: 7, nome: "Thiago Martins", cargo: "Garçom", telefone: "48999770007", dataAdmissao: new Date("2024-02-01"), salario: 1800.0 },
    ],
  });

  // ----------------------------- Cliente -----------------------------
  await prisma.cliente.createMany({
    data: [
      { id: 1, nome: "Maria Oliveira", email: "maria@email.com", telefone: "48988010001" },
      { id: 2, nome: "Pedro Santos", email: "pedro@email.com", telefone: "48988020002" },
      { id: 3, nome: "Lucia Ferreira", email: "lucia@email.com", telefone: "48988030003" },
      { id: 4, nome: "Rafael Alves", email: "rafael@email.com", telefone: "48988040004" },
      { id: 5, nome: "Camila Rocha", email: "camila@email.com", telefone: "48988050005" },
      { id: 6, nome: "Bruno Carvalho", email: "bruno@email.com", telefone: "48988060006" },
      { id: 7, nome: "Juliana Lima", email: "juliana@email.com", telefone: "48988070007" },
      { id: 8, nome: "Marcos Teixeira", email: "marcos@email.com", telefone: "48988080008" },
      { id: 9, nome: "Patrícia Gomes", email: "patricia@email.com", telefone: "48988090009" },
      { id: 10, nome: "André Ribeiro", email: "andre@email.com", telefone: "48988100010" },
    ],
  });

  // ----------------------------- Mesa -----------------------------
  await prisma.mesa.createMany({
    data: [
      { id: 1, numero: 1, capacidade: 2, status: "disponivel" },
      { id: 2, numero: 2, capacidade: 4, status: "ocupada" },
      { id: 3, numero: 3, capacidade: 6, status: "reservada" },
      { id: 4, numero: 4, capacidade: 4, status: "disponivel" },
      { id: 5, numero: 5, capacidade: 8, status: "disponivel" },
      { id: 6, numero: 6, capacidade: 2, status: "ocupada" },
      { id: 7, numero: 7, capacidade: 4, status: "disponivel" },
      { id: 8, numero: 8, capacidade: 6, status: "disponivel" },
    ],
  });

  // ----------------------------- Reserva -----------------------------
  await prisma.reserva.createMany({
    data: [
      { id: 1, idCliente: 1, idMesa: 3, dataHora: hours(2), numPessoas: 5, status: "ativa" },
      { id: 2, idCliente: 3, idMesa: 5, dataHora: hours(5), numPessoas: 7, status: "ativa" },
      { id: 3, idCliente: 2, idMesa: 4, dataHora: days(-1), numPessoas: 3, status: "concluida" },
      { id: 4, idCliente: 6, idMesa: 7, dataHora: days(1), numPessoas: 4, status: "ativa" },
      { id: 5, idCliente: 8, idMesa: 5, dataHora: days(-2), numPessoas: 6, status: "concluida" },
      { id: 6, idCliente: 5, idMesa: 3, dataHora: days(-3), numPessoas: 2, status: "cancelada" },
      { id: 7, idCliente: 10, idMesa: 7, dataHora: hours(3), numPessoas: 3, status: "ativa" },
      { id: 8, idCliente: 4, idMesa: 1, dataHora: hours(-5), numPessoas: 2, status: "concluida" },
    ],
  });

  // ----------------------------- Pedido -----------------------------
  await prisma.pedido.createMany({
    data: [
      { id: 1, dataHora: hours(-3), idMesa: 2, idFuncionario: 1, idCliente: 2, status: "entregue", total: 114.0 },
      { id: 2, dataHora: hours(-2), idMesa: 2, idFuncionario: 1, idCliente: 4, status: "entregue", total: 139.0 },
      { id: 3, dataHora: hours(-1), idMesa: null, idFuncionario: 3, idCliente: 5, status: "entregue", total: 95.0 },
      { id: 4, dataHora: hours(-4), idMesa: 6, idFuncionario: 4, idCliente: 6, status: "entregue", total: 162.0 },
      { id: 5, dataHora: min(-30), idMesa: 6, idFuncionario: 4, idCliente: 7, status: "em_preparo", total: 86.0 },
      { id: 6, dataHora: min(-20), idMesa: 2, idFuncionario: 7, idCliente: 8, status: "aberto", total: 96.0 },
      { id: 7, dataHora: hours(-5), idMesa: null, idFuncionario: 6, idCliente: 9, status: "entregue", total: 78.0 },
      { id: 8, dataHora: min(-10), idMesa: 4, idFuncionario: 1, idCliente: 10, status: "aberto", total: 60.0 },
      { id: 9, dataHora: hours(-6), idMesa: 1, idFuncionario: 4, idCliente: 1, status: "entregue", total: 46.0 },
      { id: 10, dataHora: min(-45), idMesa: 7, idFuncionario: 7, idCliente: 3, status: "em_preparo", total: 94.0 },
    ],
  });

  // ----------------------------- Item_pedido -----------------------------
  await prisma.itemPedido.createMany({
    data: [
      // pedido 1
      { idPedido: 1, idProduto: 1, quantidade: 1, precoUnit: 18.0, observacao: null },
      { idPedido: 1, idProduto: 5, quantidade: 2, precoUnit: 42.0, observacao: "Sem cebola" },
      { idPedido: 1, idProduto: 11, quantidade: 2, precoUnit: 12.0, observacao: null },
      // pedido 2
      { idPedido: 2, idProduto: 7, quantidade: 1, precoUnit: 89.0, observacao: "Ponto mal passado" },
      { idPedido: 2, idProduto: 13, quantidade: 2, precoUnit: 16.0, observacao: null },
      { idPedido: 2, idProduto: 17, quantidade: 1, precoUnit: 18.0, observacao: null },
      // pedido 3
      { idPedido: 3, idProduto: 6, quantidade: 1, precoUnit: 68.0, observacao: null },
      { idPedido: 3, idProduto: 12, quantidade: 2, precoUnit: 5.0, observacao: null },
      { idPedido: 3, idProduto: 18, quantidade: 1, precoUnit: 22.0, observacao: null },
      // pedido 4
      { idPedido: 4, idProduto: 8, quantidade: 2, precoUnit: 54.0, observacao: "Bem passado" },
      { idPedido: 4, idProduto: 15, quantidade: 2, precoUnit: 22.0, observacao: null },
      { idPedido: 4, idProduto: 19, quantidade: 1, precoUnit: 16.0, observacao: null },
      // pedido 5
      { idPedido: 5, idProduto: 10, quantidade: 1, precoUnit: 48.0, observacao: null },
      { idPedido: 5, idProduto: 14, quantidade: 2, precoUnit: 8.0, observacao: null },
      { idPedido: 5, idProduto: 2, quantidade: 1, precoUnit: 24.0, observacao: null },
      // pedido 6
      { idPedido: 6, idProduto: 9, quantidade: 1, precoUnit: 72.0, observacao: null },
      { idPedido: 6, idProduto: 16, quantidade: 1, precoUnit: 28.0, observacao: null },
      // pedido 7
      { idPedido: 7, idProduto: 3, quantidade: 1, precoUnit: 32.0, observacao: null },
      { idPedido: 7, idProduto: 5, quantidade: 1, precoUnit: 42.0, observacao: "Sem sal" },
      { idPedido: 7, idProduto: 12, quantidade: 2, precoUnit: 5.0, observacao: null },
      // pedido 8
      { idPedido: 8, idProduto: 6, quantidade: 1, precoUnit: 68.0, observacao: null },
      // pedido 9
      { idPedido: 9, idProduto: 4, quantidade: 2, precoUnit: 16.0, observacao: null },
      { idPedido: 9, idProduto: 14, quantidade: 1, precoUnit: 8.0, observacao: null },
      { idPedido: 9, idProduto: 17, quantidade: 1, precoUnit: 18.0, observacao: null },
      // pedido 10
      { idPedido: 10, idProduto: 9, quantidade: 1, precoUnit: 72.0, observacao: null },
      { idPedido: 10, idProduto: 16, quantidade: 1, precoUnit: 28.0, observacao: null },
    ],
  });

  // ----------------------------- Pagamento -----------------------------
  await prisma.pagamento.createMany({
    data: [
      { idPedido: 1, formaPgto: "pix", valorPago: 114.0, troco: 0.0, dataHora: min(-170) },
      { idPedido: 2, formaPgto: "dinheiro", valorPago: 150.0, troco: 11.0, dataHora: min(-110) },
      { idPedido: 3, formaPgto: "pix", valorPago: 95.0, troco: 0.0, dataHora: min(-50) },
      { idPedido: 4, formaPgto: "credito", valorPago: 162.0, troco: 0.0, dataHora: min(-225) },
      { idPedido: 7, formaPgto: "debito", valorPago: 78.0, troco: 0.0, dataHora: min(-295) },
      { idPedido: 9, formaPgto: "dinheiro", valorPago: 50.0, troco: 4.0, dataHora: min(-350) },
    ],
  });

  // ----- Reseta as sequences para max(id)+1 (evita conflito de PK depois) -----
  const tabelas: [string, string][] = [
    ["categoria", "id_categoria"],
    ["produto", "id_produto"],
    ["funcionario", "id_funcionario"],
    ["cliente", "id_cliente"],
    ["mesa", "id_mesa"],
    ["reserva", "id_reserva"],
    ["pedido", "id_pedido"],
    ["item_pedido", "id_item"],
    ["pagamento", "id_pagamento"],
  ];
  for (const [tabela, coluna] of tabelas) {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"${tabela}"', '${coluna}'), COALESCE((SELECT MAX("${coluna}") FROM "${tabela}"), 1), true);`
    );
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
