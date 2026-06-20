import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName = "bg-brand-50 text-brand-600",
  delta,
  hint,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  iconClassName?: string;
  delta?: number;
  hint?: string;
}) {
  const positivo = (delta ?? 0) >= 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-zinc-500">{title}</span>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-zinc-900">{value}</p>

      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold ${
              positivo ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {positivo ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-zinc-400">{hint}</span>}
      </div>
    </div>
  );
}
