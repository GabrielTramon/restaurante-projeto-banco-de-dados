import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatTime } from "@/lib/format";
import { pedidoStatusStyle } from "@/lib/status";
import type { PedidoResumo } from "@/lib/types";

export function RecentOrders({ pedidos }: { pedidos: PedidoResumo[] }) {
  return (
    <Card
      title="Pedidos recentes"
      action={
        <Link href="/pedidos" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Ver todos
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">
              <th className="px-5 py-3">Pedido</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Mesa</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Total</th>
              <th className="px-5 py-3 text-right">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {pedidos.map((pedido) => {
              const status = pedidoStatusStyle[pedido.status];
              return (
                <tr key={pedido.id} className="transition-colors hover:bg-zinc-50/70">
                  <td className="px-5 py-3 font-medium text-zinc-900">#{pedido.id}</td>
                  <td className="px-5 py-3 text-zinc-700">{pedido.cliente}</td>
                  <td className="px-5 py-3 text-zinc-500">
                    {pedido.mesa ? `Mesa ${pedido.mesa}` : "Balcão"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-zinc-900">
                    {formatCurrency(pedido.total)}
                  </td>
                  <td className="px-5 py-3 text-right text-zinc-500">
                    {formatTime(pedido.horario)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
