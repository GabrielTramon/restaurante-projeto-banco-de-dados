import type { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function DataTable<T extends { id: number }>({
  columns,
  rows,
  onEdit,
  onDelete,
}: {
  columns: Column<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}) {
  const temAcoes = Boolean(onEdit || onDelete);

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">
            {columns.map((col, i) => (
              <th key={i} className={`px-5 py-3 ${alignClass[col.align ?? "left"]}`}>
                {col.header}
              </th>
            ))}
            {temAcoes && <th className="px-5 py-3 text-right">Ações</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-zinc-50/70">
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={`px-5 py-3 text-zinc-700 ${alignClass[col.align ?? "left"]} ${col.className ?? ""}`}
                >
                  {col.cell(row)}
                </td>
              ))}
              {temAcoes && (
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-brand-600"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-rose-50 hover:text-rose-600"
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
