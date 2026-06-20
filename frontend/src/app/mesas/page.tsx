"use client";

import { useState, type FormEvent } from "react";
import { Plus, Armchair } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/form";
import { mesaStatusStyle } from "@/lib/status";
import type { Mesa, MesaStatus } from "@/lib/types";

const statusOpcoes: MesaStatus[] = ["disponivel", "ocupada", "reservada"];

export default function MesasPage() {
  const { items, loading, error, reload, create, update, remove } =
    useCrud<Mesa>("mesas");
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Mesa | null>(null);
  const [excluindo, setExcluindo] = useState<Mesa | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(false);

  const [numero, setNumero] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [status, setStatus] = useState<MesaStatus>("disponivel");
  const [formErro, setFormErro] = useState<string | null>(null);

  function abrirCriar() {
    setEditando(null);
    setNumero("");
    setCapacidade("");
    setStatus("disponivel");
    setFormErro(null);
    setFormOpen(true);
  }

  function abrirEditar(m: Mesa) {
    setEditando(m);
    setNumero(String(m.numero));
    setCapacidade(String(m.capacidade));
    setStatus(m.status);
    setFormErro(null);
    setFormOpen(true);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const numeroNum = Number(numero);
    const capacidadeNum = Number(capacidade);
    if (!Number.isInteger(numeroNum) || numeroNum <= 0)
      return setFormErro("Informe um número de mesa válido.");
    if (!Number.isInteger(capacidadeNum) || capacidadeNum <= 0)
      return setFormErro("Informe uma capacidade válida.");

    setSalvando(true);
    setFormErro(null);
    try {
      const payload = { numero: numeroNum, capacidade: capacidadeNum, status };
      if (editando) {
        await update(editando.id, payload);
        toast.success("Mesa atualizada.");
      } else {
        await create(payload);
        toast.success("Mesa criada.");
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
      toast.success("Mesa excluída.");
      setExcluindo(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setRemovendo(false);
    }
  }

  const columns: Column<Mesa>[] = [
    {
      header: "Mesa",
      cell: (m) => <span className="font-medium text-zinc-900">Mesa {m.numero}</span>,
    },
    { header: "Capacidade", cell: (m) => `${m.capacidade} lugares` },
    {
      header: "Status",
      cell: (m) => {
        const s = mesaStatusStyle[m.status];
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${s.className}`}
          >
            {s.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <PageHeader
        title="Mesas"
        subtitle="Controle a capacidade e o status das mesas do salão."
        action={
          <Button onClick={abrirCriar}>
            <Plus className="h-4 w-4" />
            Nova mesa
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
            icon={Armchair}
            title="Nenhuma mesa cadastrada"
            description="Adicione as mesas do seu salão."
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          onEdit={abrirEditar}
          onDelete={(m) => setExcluindo(m)}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editando ? "Editar mesa" : "Nova mesa"}
      >
        <form onSubmit={salvar} className="space-y-4">
          {formErro && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {formErro}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Número" required>
              <Input
                type="number"
                min="1"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ex.: 1"
                autoFocus
              />
            </Field>
            <Field label="Capacidade" required>
              <Input
                type="number"
                min="1"
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
                placeholder="Ex.: 4"
              />
            </Field>
          </div>
          <Field label="Status" required>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as MesaStatus)}
            >
              {statusOpcoes.map((s) => (
                <option key={s} value={s}>
                  {mesaStatusStyle[s].label}
                </option>
              ))}
            </Select>
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
        message={`Tem certeza que deseja excluir a Mesa ${excluindo?.numero}?`}
        loading={removendo}
        onConfirm={confirmarExclusao}
        onClose={() => setExcluindo(null)}
      />
    </div>
  );
}
