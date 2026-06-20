import type { LucideIcon } from "lucide-react";
import { Inbox, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "./Button";

export function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="grid place-items-center gap-3 rounded-2xl border border-zinc-200 bg-white py-20 text-zinc-400">
      <Spinner className="h-6 w-6 text-brand-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="grid place-items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/40 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600">
        <TriangleAlert className="h-6 w-6" />
      </span>
      <div>
        <p className="text-sm font-semibold text-zinc-900">Não foi possível carregar</p>
        <p className="mt-1 max-w-md text-sm text-zinc-500">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="grid place-items-center gap-3 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-100 text-zinc-400">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-sm font-semibold text-zinc-900">{title}</p>
        {description && (
          <p className="mt-1 max-w-md text-sm text-zinc-500">{description}</p>
        )}
      </div>
    </div>
  );
}
