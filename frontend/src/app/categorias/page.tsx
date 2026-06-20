"use client";

import { useState, type FormEvent } from "react";
import { Plus, Tags } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea } from "@/components/ui/form";
import type { Categoria } from "@/lib/types";

export default function CategoriasPage() {
  const { items, loading, error, reload, create, update, remove } =
    useCrud<Categoria>("categorias");
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [excluindo, setExcluindo] = useState<Categoria | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [formErro, setFormErro] = useState<string | null>(null);

  function abrirCriar() {
    setEditando(null);
    setNome("");
    setDescricao("");
    setFormErro(null);
    setFormOpen(true);
  }

  function abrirEditar(c: Categoria) {
    setEditando(c);
    setNome(c.nome);
    setDescricao(c.descricao ?? "");
    setFormErro(null);
    setFormOpen(true);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setFormErro("Informe o nome da categoria.");
      return;
    }
    setSalvando(true);
    setFormErro(null);
    try {
      const payload = { nome: nome.trim(), descricao: descricao.trim() || null };
      if (editando) {
        await update(editando.id, payload);
        toast.success("Categoria atualizada.");
      } else {
        await create(payload);
        toast.success("Categoria criada.");
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
      toast.success("Categoria excluída.");
      setExcluindo(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setRemovendo(false);
    }
  }

  const columns: Column<Categoria>[] = [
    {
      header: "Nome",
      cell: (c) => <span className="font-medium text-zinc-900">{c.nome}</span>,
    },
    {
      header: "Descrição",
      cell: (c) => c.descricao || <span className="text-zinc-400">—</span>,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <PageHeader
        title="Categorias"
        subtitle="Organize o cardápio em grupos como entradas, pratos e bebidas."
        action={
          <Button onClick={abrirCriar}>
            <Plus className="h-4 w-4" />
            Nova categoria
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white">
          <EmptyState
            icon={Tags}
            title="Nenhuma categoria cadastrada"
            description="Crie a primeira categoria para começar a montar o cardápio."
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          onEdit={abrirEditar}
          onDelete={(c) => setExcluindo(c)}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editando ? "Editar categoria" : "Nova categoria"}
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
              placeholder="Ex.: Bebidas"
              autoFocus
            />
          </Field>
          <Field label="Descrição">
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Opcional"
            />
          </Field>
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
        message={`Tem certeza que deseja excluir a categoria "${excluindo?.nome}"? Esta ação não pode ser desfeita.`}
        loading={removendo}
        onConfirm={confirmarExclusao}
        onClose={() => setExcluindo(null)}
      />
    </div>
  );
}
