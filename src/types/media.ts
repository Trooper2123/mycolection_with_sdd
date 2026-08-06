// src/types/media.ts

export type CategoriaMidia = 'livro' | 'jogo' | 'manga' | 'quadrinho';
export type StatusMidia = 'Lendo' | 'Jogando' | 'Lido' | 'Zerado' | 'Quero Comprar';

export interface DetalhesEspecificos {
    plataforma?: string;
    tempo_jogo?: number;
    volume_atual?: number;
    total_volumes?: number;
    editora?: string;
    autor?: string;
    paginas?: number;
}

export interface ItemMidia {
    id?: string;
    uid_usuario: string;
    titulo: string;
    categoria: CategoriaMidia;
    status: StatusMidia;
    nota: number;
    data_adicionado: {
        seconds: number;
        nanoseconds: number;
    };
    capa_url?: string;
    especificos: DetalhesEspecificos;
}

export interface Share {
    id: string;
    ownerId: string;
    ownerEmail: string;
    collaboratorEmail: string;
    role: 'editor' | 'viewer';
}