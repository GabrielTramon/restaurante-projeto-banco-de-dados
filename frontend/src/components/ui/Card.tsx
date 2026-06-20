import type { ReactNode } from "react";

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4">
          {title && <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
