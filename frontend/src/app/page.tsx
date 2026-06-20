import { DollarSign, ShoppingBag, Armchair, Receipt } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { TableStatusPanel } from "@/components/dashboard/TableStatusPanel";

export default async function DashboardPage() {
  const { kpis, faturamentoSemana, pedidosRecentes, produtosMaisVendidos, mesas } =
    await getDashboardData();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Saudação */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Bom dia, Gerente 👋
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Aqui está um resumo do que está acontecendo no restaurante hoje.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Faturamento hoje"
          value={formatCurrency(kpis.faturamentoHoje)}
          icon={DollarSign}
          iconClassName="bg-emerald-50 text-emerald-600"
          delta={kpis.faturamentoDelta}
          hint="vs. ontem"
        />
        <StatCard
          title="Pedidos hoje"
          value={String(kpis.pedidosHoje)}
          icon={ShoppingBag}
          iconClassName="bg-sky-50 text-sky-600"
          delta={kpis.pedidosDelta}
          hint="vs. ontem"
        />
        <StatCard
          title="Mesas em uso"
          value={`${kpis.mesasEmUso}/${kpis.totalMesas}`}
          icon={Armchair}
          iconClassName="bg-brand-50 text-brand-600"
          hint={`${Math.round((kpis.mesasEmUso / kpis.totalMesas) * 100)}% de ocupação`}
        />
        <StatCard
          title="Ticket médio"
          value={formatCurrency(kpis.ticketMedio)}
          icon={Receipt}
          iconClassName="bg-violet-50 text-violet-600"
          delta={kpis.ticketDelta}
          hint="vs. ontem"
        />
      </div>

      {/* Gráfico + mapa de mesas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart dados={faturamentoSemana} />
        </div>
        <TableStatusPanel mesas={mesas} />
      </div>

      {/* Pedidos recentes + mais vendidos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders pedidos={pedidosRecentes} />
        </div>
        <TopProducts produtos={produtosMaisVendidos} />
      </div>
    </div>
  );
}
