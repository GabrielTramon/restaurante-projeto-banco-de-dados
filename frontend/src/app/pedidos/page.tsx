"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Eye, Trash2, ClipboardList, X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/form";
import { formatCurrency, formatTime } from "@/lib/format";
import { pedidoStatusStyle } from "@/lib/status";
import type {
  Cliente,
  Funcionario,
  Mesa,
  Pedido,
  PedidoStatus,
  Produto,
} from "@/lib/types";

const statusList: PedidoStatus[] = [
  "aberto",
  "em_preparo",
  "pronto",
  "entregue",
  "cancelado",
];

interface ItemNovo {
  idProduto: number;
  quantidade: number;
}

export default function PedidosPage() {
  const toast = useToast();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  const [filtro, setFiltro] = useState<PedidoStatus | "todos">("todos");

  // Modais
  const [formOpen, setFormOpen] = useState(false);
  const [detalhe, setDetalhe] = useState<Pedido | null>(null);
  const [excluindo, setExcluindo] = useState<Pedido | null>(null);
  const [removendo, setRemovendo] = useState(false);

  // Formulário de novo pedido
  const [idCliente, setIdCliente] = useState("");
  const [idMesa, setIdMesa] = useState("");
  const [idFuncionario, setIdFuncionario] = useState("");
  const [itens, setItens] = useState<ItemNovo[]>([]);
  const [produtoSel, setProdutoSel] = useState("");
  const [qtdSel, setQtdSel] = useState("1");
  const [salvando, setSalvando] = useState(false);
  const [formErro, setFormErro] = useState<string | null>(null);

  const produtoPorId = useMemo(() => {
    const mapa = new Map<number, Produto>();
    produtos.forEach((p) => mapa.set(p.id, p));
    return mapa;
  }, [produtos]);

  async function reloadPedidos() {
    setLoading(true);
    try {
      setPedidos(await api.get<Pedido[]>("/api/pedidos"));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reloadPedidos();
    (async () => {
      try {
        const [prod, cli, mes, func] = await Promise.all([
          api.get<Produto[]>("/api/produtos"),
          api.get<Cliente[]>("/api/clientes"),
          api.get<Mesa[]>("/api/mesas"),
          api.get<Funcionario[]>("/api/funcionarios"),
        ]);
        setProdutos(prod);
        setClientes(cli);
        setMesas(mes);
        setFuncionarios(func);
      } catch {
        // listas auxiliares indisponíveis; o erro de pedidos já cobre o caso.
      }
    })();
  }, []);

  const pedidosFiltrados =
    filtro === "todos" ? pedidos : pedidos.filter((p) => p.status === filtro);

  const totalPreview = itens.reduce((acc, item) => {
    const produto = produtoPorId.get(item.idProduto);
    return acc + (produto ? produto.preco * item.quantidade : 0);
  }, 0);

  function abrirCriar() {
    setIdCliente("");
    setIdMesa("");
    setIdFuncionario("");
    setItens([]);
    setProdutoSel("");
    setQtdSel("1");
    setFormErro(null);
    setFormOpen(true);
  }

  function adicionarItem() {
    const id = Number(produtoSel);
    const qtd = Number(qtdSel);
    if (!id) return setFormErro("Selecione um produto.");
    if (!Number.isInteger(qtd) || qtd <= 0)
      return setFormErro("Quantidade inválida.");
    setFormErro(null);
    setItens((prev) => {
      const existente = prev.find((i) => i.idProduto === id);
      if (existente) {
        return prev.map((i) =>
          i.idProduto === id ? { ...i, quantidade: i.quantidade + qtd } : i
        );
      }
      return [...prev, { idProduto: id, quantidade: qtd }];
    });
    setProdutoSel("");
    setQtdSel("1");
  }

  function removerItem(idProduto: number) {
    setItens((prev) => prev.filter((i) => i.idProduto !== idProduto));
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (itens.length === 0) return setFormErro("Adicione ao menos um item.");

    setSalvando(true);
    setFormErro(null);
    try {
      const payload = {
        idCliente: idCliente ? Number(idCliente) : null,
        idMesa: idMesa ? Number(idMesa) : null,
        idFuncionario: idFuncionario ? Number(idFuncionario) : null,
        itens: itens.map((i) => ({
          idProduto: i.idProduto,
          quantidade: i.quantidade,
        })),
      };
      await api.post<Pedido>("/api/pedidos", payload);
      toast.success("Pedido criado.");
      setFormOpen(false);
      await reloadPedidos();
    } catch (err) {
      setFormErro(err instanceof Error ? err.message : "Erro ao criar o pedido.");
    } finally {
      setSalvando(false);
    }
  }

  async function mudarStatus(pedido: Pedido, status: PedidoStatus) {
    try {
      await api.patch<Pedido>(`/api/pedidos/${pedido.id}/status`, { status });
      toast.success("Status atualizado.");
      await reloadPedidos();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar status.");
      await reloadPedidos();
    }
  }

  async function confirmarExclusao() {
    if (!excluindo) return;
    setRemovendo(true);
    try {
      await api.delete(`/api/pedidos/${excluindo.id}`);
      toast.success("Pedido excluído.");
      setExcluindo(null);
      await reloadPedidos();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <PageHeader
        title="Pedidos"
        subtitle="Acompanhe e gerencie os pedidos do salão e do balcão."
        action={
          <Button onClick={abrirCriar} disabled={produtos.length === 0}>
            <Plus className="h-4 w-4" />
            Novo pedido
          </Button>
        }
      />

      {/* Filtros por status */}
      <div className="flex flex-wrap gap-2">
        {(["todos", ...statusList] as const).map((s) => {
          const ativo = filtro === s;
          const label = s === "todos" ? "Todos" : pedidoStatusStyle[s].label;
          return (
            <button
              key={s}
              onClick={() => setFiltro(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                ativo
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reloadPedidos} />
      ) : pedidosFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white">
          <EmptyState
            icon={ClipboardList}
            title="Nenhum pedido"
            description={
              filtro === "todos"
                ? "Crie o primeiro pedido do restaurante."
                : "Nenhum pedido com esse status."
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Mesa</th>
                <th className="px-5 py-3 text-center">Itens</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-zinc-50/70">
                  <td className="px-5 py-3">
                    <p className="font-medium text-zinc-900">#{pedido.id}</p>
                    <p className="text-xs text-zinc-400">
                      {formatTime(pedido.dataHora)}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-zinc-700">
                    {pedido.cliente?.nome ?? (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-zinc-500">
                    {pedido.mesa ? `Mesa ${pedido.mesa.numero}` : "Balcão"}
                  </td>
                  <td className="px-5 py-3 text-center text-zinc-500">
                    {pedido.itens.length}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-zinc-900">
                    {formatCurrency(pedido.total)}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={pedido.status}
                      onChange={(e) =>
                        mudarStatus(pedido, e.target.value as PedidoStatus)
                      }
                      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none ring-1 ring-inset ${pedidoStatusStyle[pedido.status].className}`}
                    >
                      {statusList.map((s) => (
                        <option key={s} value={s}>
                          {pedidoStatusStyle[s].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setDetalhe(pedido)}
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-brand-600"
                        aria-label="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setExcluindo(pedido)}
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: novo pedido */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Novo pedido">
        <form onSubmit={salvar} className="space-y-4">
          {formErro && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {formErro}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Cliente">
              <Select value={idCliente} onChange={(e) => setIdCliente(e.target.value)}>
                <option value="">— Sem cliente —</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Mesa">
              <Select value={idMesa} onChange={(e) => setIdMesa(e.target.value)}>
                <option value="">— Balcão —</option>
                {mesas.map((m) => (
                  <option key={m.id} value={m.id}>
                    Mesa {m.numero}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Atendente">
              <Select
                value={idFuncionario}
                onChange={(e) => setIdFuncionario(e.target.value)}
              >
                <option value="">— Nenhum —</option>
                {funcionarios.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          {/* Adicionar item */}
          <div className="rounded-xl border border-zinc-200 p-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Field label="Produto">
                  <Select
                    value={produtoSel}
                    onChange={(e) => setProdutoSel(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {produtos
                      .filter((p) => p.disponivel)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} — {formatCurrency(p.preco)}
                        </option>
                      ))}
                  </Select>
                </Field>
              </div>
              <div className="w-20">
                <Field label="Qtd">
                  <Input
                    type="number"
                    min="1"
                    value={qtdSel}
                    onChange={(e) => setQtdSel(e.target.value)}
                  />
                </Field>
              </div>
              <Button type="button" variant="secondary" onClick={adicionarItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {itens.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {itens.map((item) => {
                  const produto = produtoPorId.get(item.idProduto);
                  if (!produto) return null;
                  return (
                    <li
                      key={item.idProduto}
                      className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm"
                    >
                      <span className="text-zinc-700">
                        <span className="font-medium">{item.quantidade}x</span>{" "}
                        {produto.nome}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-zinc-900">
                          {formatCurrency(produto.preco * item.quantidade)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removerItem(item.idProduto)}
                          className="text-zinc-400 hover:text-rose-600"
                          aria-label="Remover item"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-sm font-medium text-zinc-500">Total</span>
              <span className="text-base font-bold text-zinc-900">
                {formatCurrency(totalPreview)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFormOpen(false)}
              disabled={salvando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? "Criando..." : "Criar pedido"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: detalhes */}
      <Modal
        open={Boolean(detalhe)}
        onClose={() => setDetalhe(null)}
        title={detalhe ? `Pedido #${detalhe.id}` : "Pedido"}
      >
        {detalhe && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-zinc-400">Cliente</p>
                <p className="font-medium text-zinc-900">
                  {detalhe.cliente?.nome ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Mesa</p>
                <p className="font-medium text-zinc-900">
                  {detalhe.mesa ? `Mesa ${detalhe.mesa.numero}` : "Balcão"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Atendente</p>
                <p className="font-medium text-zinc-900">
                  {detalhe.funcionario?.nome ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Status</p>
                <span
                  className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${pedidoStatusStyle[detalhe.status].className}`}
                >
                  {pedidoStatusStyle[detalhe.status].label}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200">
              <ul className="divide-y divide-zinc-100">
                {detalhe.itens.map((item) => (
                  <li key={item.id} className="flex justify-between gap-2 px-3 py-2.5 text-sm">
                    <div>
                      <p className="text-zinc-800">
                        <span className="font-medium">{item.quantidade}x</span>{" "}
                        {item.produtoNome}
                      </p>
                      {item.observacao && (
                        <p className="text-xs text-zinc-400">{item.observacao}</p>
                      )}
                    </div>
                    <span className="font-medium text-zinc-900">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-zinc-200 px-3 py-2.5">
                <span className="text-sm font-medium text-zinc-500">Total</span>
                <span className="text-base font-bold text-zinc-900">
                  {formatCurrency(detalhe.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(excluindo)}
        message={`Tem certeza que deseja excluir o pedido #${excluindo?.id}?`}
        loading={removendo}
        onConfirm={confirmarExclusao}
        onClose={() => setExcluindo(null)}
      />
    </div>
  );
}
