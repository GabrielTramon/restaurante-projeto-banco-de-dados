"use client";

import { useState, type FormEvent } from "react";
import { Plus, Users } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/form";
import type { Cliente } from "@/lib/types";

export default function ClientesPage() {
  const { items, loading, error, reload, create, update, remove } =
    useCrud<Cliente>("clientes");
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [excluindo, setExcluindo] = useState<Cliente | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [formErro, setFormErro] = useState<string | null>(null);

  function abrirCriar() {
    setEditando(null);
    setNome("");
    setEmail("");
    setTelefone("");
    setFormErro(null);
    setFormOpen(true);
  }

  function abrirEditar(c: Cliente) {
    setEditando(c);
    setNome(c.nome);
    setEmail(c.email ?? "");
    setTelefone(c.telefone ?? "");
    setFormErro(null);
    setFormOpen(true);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return setFormErro("Informe o nome do cliente.");

    setSalvando(true);
    setFormErro(null);
    try {
      const payload = {
        nome: nome.trim(),
        email: email.trim() || null,
        telefone: telefone.trim() || null,
      };
      if (editando) {
        await update(editando.id, payload);
        toast.success("Cliente atualizado.");
      } else {
        await create(payload);
        toast.success("Cliente criado.");
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
      toast.success("Cliente excluído.");
      setExcluindo(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setRemovendo(false);
    }
  }

  const columns: Column<Cliente>[] = [
    {
      header: "Nome",
      cell: (c) => <span className="font-medium text-zinc-900">{c.nome}</span>,
    },
    { header: "E-mail", cell: (c) => c.email || <span className="text-zinc-400">—</span> },
    {
      header: "Telefone",
      cell: (c) => c.telefone || <span className="text-zinc-400">—</span>,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <PageHeader
        title="Clientes"
        subtitle="Cadastro de clientes e contatos."
        action={
          <Button onClick={abrirCriar}>
            <Plus className="h-4 w-4" />
            Novo cliente
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
            icon={Users}
            title="Nenhum cliente cadastrado"
            description="Adicione o primeiro cliente do seu restaurante."
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
        title={editando ? "Editar cliente" : "Novo cliente"}
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
              placeholder="Ex.: Maria Oliveira"
              autoFocus
            />
          </Field>
          <Field label="E-mail">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@email.com"
            />
          </Field>
          <Field label="Telefone">
            <Input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(48) 99999-0000"
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
        message={`Tem certeza que deseja excluir o cliente "${excluindo?.nome}"?`}
        loading={removendo}
        onConfirm={confirmarExclusao}
        onClose={() => setExcluindo(null)}
      />
    </div>
  );
}
