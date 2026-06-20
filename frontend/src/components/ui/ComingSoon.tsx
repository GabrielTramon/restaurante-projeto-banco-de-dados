import type { LucideIcon } from "lucide-react";
import { Hammer } from "lucide-react";

export function ComingSoon({
  titulo,
  descricao,
  icon: Icon,
}: {
  titulo: string;
  descricao: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-zinc-900">{titulo}</h2>
        <p className="mt-1 max-w-md text-sm text-zinc-500">{descricao}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
          <Hammer className="h-3.5 w-3.5" />
          Em construção
        </span>
      </div>
    </div>
  );
}
