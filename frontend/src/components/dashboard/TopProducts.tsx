import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import type { ProdutoMaisVendido } from "@/lib/types";

export function TopProducts({ produtos }: { produtos: ProdutoMaisVendido[] }) {
  const maiorReceita = Math.max(...produtos.map((p) => p.receita));

  return (
    <Card title="Mais vendidos">
      <ul className="divide-y divide-zinc-50">
        {produtos.map((produto, index) => {
          const largura = maiorReceita > 0 ? (produto.receita / maiorReceita) * 100 : 0;
          return (
            <li key={produto.nome} className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-600">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">{produto.nome}</p>
                  <p className="text-xs text-zinc-400">
                    {produto.categoria} · {produto.quantidade} vendas
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-zinc-900">
                  {formatCurrency(produto.receita)}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-brand-400"
                  style={{ width: `${largura}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
