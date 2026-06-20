import Link from "next/link";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Mesa, MesaStatus } from "@/lib/types";

const tileStyle: Record<MesaStatus, string> = {
  disponivel: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ocupada: "border-rose-200 bg-rose-50 text-rose-700",
  reservada: "border-amber-200 bg-amber-50 text-amber-700",
};

const dotStyle: Record<MesaStatus, string> = {
  disponivel: "bg-emerald-500",
  ocupada: "bg-rose-500",
  reservada: "bg-amber-500",
};

const legenda: { status: MesaStatus; label: string }[] = [
  { status: "disponivel", label: "Disponível" },
  { status: "ocupada", label: "Ocupada" },
  { status: "reservada", label: "Reservada" },
];

export function TableStatusPanel({ mesas }: { mesas: Mesa[] }) {
  const contar = (status: MesaStatus) =>
    mesas.filter((m) => m.status === status).length;

  return (
    <Card
      title="Mapa de mesas"
      action={
        <Link href="/mesas" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Gerenciar
        </Link>
      }
    >
      <div className="p-5">
        <div className="grid grid-cols-4 gap-3">
          {mesas.map((mesa) => (
            <div
              key={mesa.id}
              className={`flex flex-col items-center justify-center rounded-xl border py-3 ${tileStyle[mesa.status]}`}
              title={mesa.status}
            >
              <span className="text-base font-bold">{mesa.numero}</span>
              <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium opacity-80">
                <Users className="h-3 w-3" />
                {mesa.capacidade}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-100 pt-4">
          {legenda.map(({ status, label }) => (
            <div key={status} className="flex items-center gap-2 text-xs text-zinc-600">
              <span className={`h-2.5 w-2.5 rounded-full ${dotStyle[status]}`} />
              {label}
              <span className="font-semibold text-zinc-900">{contar(status)}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
