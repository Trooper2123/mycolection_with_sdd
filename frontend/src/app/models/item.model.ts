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
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
