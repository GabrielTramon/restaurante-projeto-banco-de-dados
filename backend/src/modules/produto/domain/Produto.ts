/** Entidade de domínio Produto. `preco` é number (Decimal é detalhe do banco). */
export interface Produto {
  id: number;
  idCategoria: number;
  nome: string;
  descricao: string | null;
  preco: number;
  disponivel: boolean;
}
