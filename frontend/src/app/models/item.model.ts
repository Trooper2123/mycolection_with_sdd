export type TipoMidia = 'LIVRO' | 'QUADRINHO' | 'MANGA' | 'JOGO';

export interface ItemRequest {
  nome: string;
  tipoMidia: TipoMidia;
  categorias: string[];
  descricao?: string;
  tags?: string;
  console?: string;
}

export interface ItemResponse extends ItemRequest {
  id: number;
  dataRetirada: string | null;
  dataDevolucao: string | null;
  perdido: boolean;
  justificativaPerda: string | null;
  /** Derivado pelo BFF: "Disponível" | "Emprestado" | "Perdido" */
  statusEmprestimo: string;
  /** Derivado pelo BFF: "Livro" | "Quadrinho" | "Mangá" | "Jogo" */
  labelTipoMidia: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
