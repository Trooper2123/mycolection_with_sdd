export type TipoMidia = 'LIVRO' | 'QUADRINHO' | 'MANGA' | 'JOGO';

export interface Item {
  id?: string;
  nome: string;
  tipoMidia: TipoMidia;
  categorias: string[];
  descricao: string | null;    // null quando não preenchido (Firestore não aceita undefined)
  tags: string | null;         // null quando não preenchido
  console: string | null;      // null quando tipoMidia != JOGO
  dataRetirada: string | null; // ISO string YYYY-MM-DD or null
  dataDevolucao: string | null;
  perdido: boolean;
  justificativaPerda: string | null;
  ownerId: string;
  ownerEmail: string;
}

export interface Share {
  id?: string;
  ownerId: string;
  ownerEmail: string;
  collaboratorEmail: string;
  role: 'editor' | 'viewer';
}

export const getStatusEmprestimo = (item: Item): 'Disponível' | 'Emprestado' | 'Perdido' => {
  if (item.perdido) return 'Perdido';
  if (item.dataRetirada || item.dataDevolucao) return 'Emprestado';
  return 'Disponível';
};

export const getLabelTipoMidia = (tipo: TipoMidia): string => {
  switch (tipo) {
    case 'LIVRO': return 'Livro';
    case 'QUADRINHO': return 'Quadrinho';
    case 'MANGA': return 'Mangá';
    case 'JOGO': return 'Jogo';
  }
};
