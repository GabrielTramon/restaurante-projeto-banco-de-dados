"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus, UtensilsCrossed } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea, Select, Checkbox } from "@/components/ui/form";
import { formatCurrency } from "@/lib/format";
import type { Categoria, Produto } from "@/lib/types";

export default function ProdutosPage() {
  const { items, loading, error, reload, create, update, remove } =
    useCrud<Produto>("produtos");
  const { items: categorias } = useCrud<Categoria>("categorias");
  const toast = useToast();

  const categoriaNome = useMemo(() => {
    const mapa = new Map<number, string>();
    categorias.forEach((c) => mapa.set(c.id, c.nome));
    return mapa;
  }, [categorias]);

  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState<Produto | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [disponivel, setDisponivel] = useState(true);
  const [formErro, setFormErro] = useState<string | null>(null);

  function abrirCriar() {
    setEditando(null);
    setNome("");
    setDescricao("");
    setPreco("");
    setIdCategoria(categorias[0] ? String(categorias[0].id) : "");
    setDisponivel(true);
    setFormErro(null);
    setFormOpen(true);
  }

  function abrirEditar(p: Produto) {
    setEditando(p);
    setNome(p.nome);
    setDescricao(p.descricao ?? "");
    setPreco(String(p.preco));
    setIdCategoria(String(p.idCategoria));
    setDisponivel(p.disponivel);
    setFormErro(null);
    setFormOpen(true);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return setFormErro("Informe o nome do produto.");
    if (!idCategoria) return setFormErro("Selecione uma categoria.");
    const precoNum = Number(preco);
    if (Number.isNaN(precoNum) || precoNum < 0)
      return setFormErro("Informe um preço válido.");

    setSalvando(true);
    setFormErro(null);
    try {
      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        preco: precoNum,
        idCategoria: Number(idCategoria),
        disponivel,
      };
      if (editando) {
        await update(editando.id, payload);
        toast.success("Produto atualizado.");
      } else {
        await create(payload);
        toast.success("Produto criado.");
      }
      setFormOpen(false);
      await reload();
    } catch (err) {
      setFormErro(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!excluindo) return;
    setRemovendo(true);
    try {
      await remove(excluindo.id);
      toast.success("Produto excluído.");
      setExcluindo(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setRemovendo(false);
    }
  }

  const columns: Column<Produto>[] = [
    {
      header: "Produto",
      cell: (p) => (
        <div>
          <p className="font-medium text-zinc-900">{p.nome}</p>
          {p.descricao && (
            <p className="max-w-xs truncate text-xs text-zinc-400">{p.descricao}</p>
          )}
        </div>
      ),
    },
    {
      header: "Categoria",
      cell: (p) => categoriaNome.get(p.idCategoria) ?? `#${p.idCategoria}`,
    },
    {
      header: "Preço",
      align: "right",
      cell: (p) => (
        <span className="font-medium text-zinc-900">{formatCurrency(p.preco)}</span>
      ),
    },
    {
      header: "Disponível",
      align: "center",
      cell: (p) =>
        p.disponivel ? (
          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Sim
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 ring-1 ring-inset ring-zinc-300">
            Não
          </span>
        ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <PageHeader
        title="Cardápio"
        subtitle="Cadastre os produtos, preços e disponibilidade."
        action={
          <Button onClick={abrirCriar} disabled={categorias.length === 0}>
            <Plus className="h-4 w-4" />
            Novo produto
          </Button>
        }
      />

      {categorias.length === 0 && !loading && !error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          Cadastre ao menos uma categoria antes de adicionar produtos.
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white">
          <EmptyState
            icon={UtensilsCrossed}
            title="Nenhum produto no cardápio"
            description="Adicione o primeiro prato ou bebida do seu restaurante."
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          onEdit={abrirEditar}
          onDelete={(p) => setExcluindo(p)}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editando ? "Editar produto" : "Novo produto"}
      >
        <form onSubmit={salvar} className="space-y-4">
          {formErro && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {formErro}
            </div>
          )}
          <Field label="Nome" required>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Picanha na Brasa"
              autoFocus
            />
          </Field>
          <Field label="Descrição">
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              placeholder="Opcional"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Preço (R$)" required>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="0,00"
              />
            </Field>
            <Field label="Categoria" required>
              <Select
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Checkbox
            label="Disponível no cardápio"
            checked={disponivel}
            onChange={(e) => setDisponivel(e.target.checked)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFormOpen(false)}
              disabled={salvando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(excluindo)}
        message={`Tem certeza que deseja excluir "${excluindo?.nome}" do cardápio?`}
        loading={removendo}
        onConfirm={confirmarExclusao}
        onClose={() => setExcluindo(null)}
      />
    </div>
  );
}
