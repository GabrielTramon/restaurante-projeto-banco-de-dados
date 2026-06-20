import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import type { PontoFaturamento } from "@/lib/types";

export function RevenueChart({ dados }: { dados: PontoFaturamento[] }) {
  const maior = Math.max(...dados.map((d) => d.valor));
  const total = dados.reduce((acc, d) => acc + d.valor, 0);

  return (
    <Card
      title="Faturamento da semana"
      action={
        <span className="text-sm font-semibold text-zinc-900">
          {formatCurrency(total)}
        </span>
      }
    >
      <div className="px-5 pb-5 pt-6">
        <div className="flex h-52 items-end justify-between gap-3">
          {dados.map((d) => {
            const altura = maior > 0 ? Math.round((d.valor / maior) * 100) : 0;
            const destaque = d.valor === maior;
            return (
              <div key={d.dia} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`group relative w-full rounded-t-md transition-all ${
                      destaque
                        ? "bg-brand-500"
                        : "bg-brand-200 hover:bg-brand-300"
                    }`}
                    style={{ height: `${altura}%` }}
                  >
                    <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {formatCurrency(d.valor)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-zinc-500">{d.dia}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
