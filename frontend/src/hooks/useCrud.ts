"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

/**
 * Hook genérico de CRUD para um recurso REST (`/api/<recurso>`).
 * Centraliza o carregamento da lista, estados de loading/erro e as mutações.
 */
export function useCrud<T extends { id: number }>(resource: string) {
  const path = `/api/${resource}`;
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<T[]>(path);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = useCallback(
    (data: unknown) => api.post<T>(path, data),
    [path]
  );

  const update = useCallback(
    (id: number, data: unknown) => api.put<T>(`${path}/${id}`, data),
    [path]
  );

  const remove = useCallback(
    (id: number) => api.delete<void>(`${path}/${id}`),
    [path]
  );

  return { items, loading, error, reload, create, update, remove };
}
