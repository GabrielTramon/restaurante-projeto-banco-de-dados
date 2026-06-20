"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export function ConfirmDialog({
  open,
  title = "Confirmar exclusão",
  message,
  confirmLabel = "Excluir",
  loading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <p className="pt-1.5 text-sm text-zinc-600">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Excluindo..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
