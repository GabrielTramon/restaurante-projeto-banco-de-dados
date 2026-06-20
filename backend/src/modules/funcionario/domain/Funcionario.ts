/** Entidade de domínio Funcionario. `salario` é number; Decimal é detalhe do banco. */
export interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  telefone: string | null;
  dataAdmissao: Date;
  salario: number;
}
