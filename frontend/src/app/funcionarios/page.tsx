"use client";

import { useState, type FormEvent } from "react";
import { Plus, ChefHat } from "lucide-react";
import { useCrud } from "@/hooks/useCrud";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/form";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Funcionario } from "@/lib/types";

export default function FuncionariosPage() {
  const { items, loading, error, reload, create, update, remove } =
    useCrud<Funcionario>("funcionarios");
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [excluindo, setExcluindo] = useState<Funcionario | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(false);

  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [salario, setSalario] = useState("");
  const [formErro, setFormErro] = useState<string | null>(null);

  function abrirCriar() {
    setEditando(null);
    setNome("");
    setCargo("");
    setTelefone("");
    setDataAdmissao("");
    setSalario("");
    setFormErro(null);
    setFormOpen(true);
  }

  function abrirEditar(f: Funcionario) {
    setEditando(f);
    setNome(f.nome);
    setCargo(f.cargo);
    setTelefone(f.telefone ?? "");
    setDataAdmissao(f.dataAdmissao ? f.dataAdmissao.slice(0, 10) : "");
    setSalario(String(f.salario));
    setFormErro(null);
    setFormOpen(true);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return setFormErro("Informe o nome.");
    if (!cargo.trim()) return setFormErro("Informe o cargo.");
    const salarioNum = Number(salario);
    if (Number.isNaN(salarioNum) || salarioNum < 0)
      return setFormErro("Informe um salário válido.");

    setSalvando(true);
    setFormErro(null);
    try {
      const payload = {
        nome: nome.trim(),
        cargo: cargo.trim(),
        telefone: telefone.trim() || null,
        salario: salarioNum,
        ...(dataAdmissao ? { dataAdmissao } : {}),
      };
      if (editando) {
        await update(editando.id, payload);
        toast.success("Funcionário atualizado.");
      } else {
        await create(payload);
        toast.success("Funcionário criado.");
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
      toast.success("Funcionário excluído.");
      setExcluindo(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setRemovendo(false);
    }
  }

  const columns: Column<Funcionario>[] = [
    {
      header: "Nome",
      cell: (f) => <span className="font-medium text-zinc-900">{f.nome}</span>,
    },
    { header: "Cargo", cell: (f) => f.cargo },
    {
      header: "Telefone",
      cell: (f) => f.telefone || <span className="text-zinc-400">—</span>,
    },
    {
      header: "Admissão",
      cell: (f) => (f.dataAdmissao ? formatDate(f.dataAdmissao) : "—"),
    },
    {
      header: "Salário",
      align: "right",
      cell: (f) => (
        <span className="font-medium text-zinc-900">{formatCurrency(f.salario)}</span>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <PageHeader
        title="Funcionários"
        subtitle="Gerencie a equipe, cargos e dados de admissão."
        action={
          <Button onClick={abrirCriar}>
            <Plus className="h-4 w-4" />
            Novo funcionário
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
            icon={ChefHat}
            title="Nenhum funcionário cadastrado"
            description="Adicione o primeiro integrante da equipe."
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          onEdit={abrirEditar}
          onDelete={(f) => setExcluindo(f)}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editando ? "Editar funcionário" : "Novo funcionário"}
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
              placeholder="Ex.: Carlos Souza"
              autoFocus
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cargo" required>
              <Input
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ex.: Garçom"
              />
            </Field>
            <Field label="Telefone">
              <Input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(48) 99999-0000"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Salário (R$)" required>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                placeholder="0,00"
              />
            </Field>
            <Field label="Data de admissão">
              <Input
                type="date"
                value={dataAdmissao}
                onChange={(e) => setDataAdmissao(e.target.value)}
              />
            </Field>
          </div>
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
        message={`Tem certeza que deseja excluir o funcionário "${excluindo?.nome}"?`}
        loading={removendo}
        onConfirm={confirmarExclusao}
        onClose={() => setExcluindo(null)}
      />
    </div>
  );
}
