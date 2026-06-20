/** Status possíveis de uma mesa (espelha o enum MesaStatus do banco). */
export type MesaStatus = "disponivel" | "ocupada" | "reservada";

/** Entidade de domínio Mesa. */
export interface Mesa {
  id: number;
  numero: number;
  capacidade: number;
  status: MesaStatus;
}
