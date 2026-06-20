"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Tags,
  Armchair,
  Users,
  ChefHat,
  Menu,
  X,
  Search,
  Bell,
} from "lucide-react";
import { ToastProvider } from "@/components/ui/Toast";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Pedidos", href: "/pedidos", icon: ClipboardList },
  { label: "Cardápio", href: "/produtos", icon: UtensilsCrossed },
  { label: "Categorias", href: "/categorias", icon: Tags },
  { label: "Mesas", href: "/mesas", icon: Armchair },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Funcionários", href: "/funcionarios", icon: ChefHat },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({
  children,
  dataHoje,
}: {
  children: React.ReactNode;
  dataHoje: string;
}) {
  const pathname = usePathname();
  const [mobileAberto, setMobileAberto] = useState(false);

  const tituloPagina =
    navItems.find((item) => isActive(pathname, item.href))?.label ?? "Painel";

  return (
    <div className="min-h-screen">
      {/* Overlay do menu mobile */}
      {mobileAberto && (
        <div
          className="fixed inset-0 z-30 bg-zinc-900/50 lg:hidden"
          onClick={() => setMobileAberto(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-zinc-900 text-zinc-300 transition-transform duration-300 lg:translate-x-0 ${
          mobileAberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 px-6">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
            <UtensilsCrossed className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Sabor &amp; Cia</p>
            <p className="text-xs text-zinc-400">Painel de gestão</p>
          </div>
          <button
            className="ml-auto rounded-md p-1 text-zinc-400 hover:text-white lg:hidden"
            onClick={() => setMobileAberto(false)}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const ativo = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileAberto(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  ativo
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-700 text-sm font-semibold text-white">
              GA
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-white">Gerente</p>
              <p className="truncate text-xs text-zinc-400">admin@saborecia.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 lg:hidden"
            onClick={() => setMobileAberto(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-zinc-900">
              {tituloPagina}
            </h1>
            <p className="hidden text-xs text-zinc-500 sm:block">{dataHoje}</p>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 md:flex">
              <Search className="h-4 w-4" />
              <input
                placeholder="Buscar..."
                className="w-40 bg-transparent outline-none placeholder:text-zinc-400"
              />
            </div>
            <button
              className="relative rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-50"
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <ToastProvider>{children}</ToastProvider>
        </main>
      </div>
    </div>
  );
}
