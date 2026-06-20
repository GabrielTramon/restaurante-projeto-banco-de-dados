import type { MesaStatus, PedidoStatus } from "./types";

interface StatusStyle {
  label: string;
  className: string;
}

export const pedidoStatusStyle: Record<PedidoStatus, StatusStyle> = {
  aberto: { label: "Aberto", className: "bg-sky-50 text-sky-700 ring-sky-600/20" },
  em_preparo: { label: "Em preparo", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  pronto: { label: "Pronto", className: "bg-violet-50 text-violet-700 ring-violet-600/20" },
  entregue: { label: "Entregue", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  cancelado: { label: "Cancelado", className: "bg-rose-50 text-rose-700 ring-rose-600/20" },
};

export const mesaStatusStyle: Record<MesaStatus, StatusStyle> = {
  disponivel: { label: "Disponível", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  ocupada: { label: "Ocupada", className: "bg-rose-50 text-rose-700 ring-rose-600/20" },
  reservada: { label: "Reservada", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
};
