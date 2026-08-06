// src/components/Collection.tsx
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';
import { ItemMidia, Share, CategoriaMidia } from '../types/media';
import {
  Trash2, BookOpen, Gamepad2, Loader, ChevronLeft, ChevronRight, Star
} from 'lucide-react';

interface CollectionProps {
  user: User;
}

export const Collection: React.FC<CollectionProps> = ({ user }) => {
  // --- Estados de Compartilhamento e Espaços ---
  const [activeSpace, setActiveSpace] = useState<'mine' | string>('mine');
  const [myShares, setMyShares] = useState<Share[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<Share[]>([]);
  const [activePermission, setActivePermission] = useState<'owner' | 'editor' | 'viewer'>('owner');

  // --- Estados do Acervo (Monitorados em Tempo Real) ---
  const [items, setItems] = useState<ItemMidia[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<CategoriaMidia | 'ALL'>('ALL');
  const [buscaTexto, setBuscaTexto] = useState<string>('');

  // --- Estados de Paginação ---
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;

  // --- Estados de Feedback ---
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // --- Efeito: Monitora compartilhamentos ---
  useEffect(() => {
    if (!db || !user) return;

    const qMyShares = query(collection(db, 'shares'), where('ownerId', '==', user.uid));
    const unsubMyShares = onSnapshot(qMyShares, (snapshot) => {
      const sharesList: Share[] = [];
      snapshot.forEach((doc) => {
        sharesList.push({ id: doc.id, ...doc.data() } as Share);
      });
      setMyShares(sharesList);
    });

    const userEmailNormalized = user.email?.toLowerCase() || '';
    const qSharedWithMe = query(
      collection(db, 'shares'),
      where('collaboratorEmail', '==', userEmailNormalized)
    );
    const unsubSharedWithMe = onSnapshot(qSharedWithMe, (snapshot) => {
      const sharedList: Share[] = [];
      snapshot.forEach((doc) => {
        sharedList.push({ id: doc.id, ...doc.data() } as Share);
      });
      setSharedWithMe(sharedList);
    });

    return () => {
      unsubMyShares();
      unsubSharedWithMe();
    };
  }, [user]);

  // --- Efeito: Define permissão ativa com base no espaço selecionado ---
  useEffect(() => {
    if (activeSpace === 'mine') {
      setActivePermission('owner');
    } else {
      const currentShare = sharedWithMe.find(s => s.ownerId === activeSpace);
      if (currentShare) {
        setActivePermission(currentShare.role);
      } else {
        setActivePermission('viewer');
      }
    }
    setPage(0);
  }, [activeSpace, sharedWithMe]);

  // --- Efeito: Escuta itens da coleção em tempo real ---
  useEffect(() => {
    if (!db || !user) return;

    setLoadingItems(true);
    const targetOwnerId = activeSpace === 'mine' ? user.uid : activeSpace;

    const qItems = query(
      collection(db, 'midias'),
      where('uid_usuario', '==', targetOwnerId)
    );

    const unsubItems = onSnapshot(qItems, (snapshot) => {
      const itemsList: ItemMidia[] = [];
      snapshot.forEach((doc) => {
        itemsList.push({ id: doc.id, ...doc.data() } as ItemMidia);
      });

      itemsList.sort((a, b) => {
        const dataA = a.data_adicionado?.seconds || 0;
        const dataB = b.data_adicionado?.seconds || 0;
        return dataB - dataA;
      });

      setItems(itemsList);
      setLoadingItems(false);
    }, (error) => {
      console.error("Erro ao escutar mídias:", error);
      showFeedback('Erro ao carregar dados em tempo real.', 'error');
      setLoadingItems(false);
    });

    return () => unsubItems();
  }, [activeSpace, user]);

  // --- Método: Deletar Item ---
  const handleDeleteItem = async (id: string) => {
    if (activePermission === 'viewer') {
      showFeedback('Apenas leitores não podem remover itens.', 'error');
      return;
    }

    if (!window.confirm("Deseja realmente remover este item da sua coleção?")) return;

    try {
      await deleteDoc(doc(db, 'midias', id));
      showFeedback('Item removido com sucesso.', 'success');
    } catch (error) {
      console.error("Erro ao deletar:", error);
      showFeedback('Erro ao remover o item.', 'error');
    }
  };

  // --- Filtros locais aplicados no Array reativo ---
  const itensFiltrados = items.filter(item => {
    const correspondeFiltroTipo = mediaTypeFilter === 'ALL' || item.categoria === mediaTypeFilter;
    const correspondeBuscaTexto = item.titulo.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      item.especificos?.autor?.toLowerCase().includes(buscaTexto.toLowerCase());
    return correspondeFiltroTipo && correspondeBuscaTexto;
  });

  // --- Paginação lógica ---
  const totalPages = Math.ceil(itensFiltrados.length / itemsPerPage);
  const itensPaginados = itensFiltrados.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div className="space-y-4 text-slate-100">
      {message && (
        <div className={`fixed top-4 left-4 right-4 p-3 rounded-lg z-50 text-xs font-bold shadow-lg border text-center ${message.type === 'success' ? 'bg-emerald-950 border-emerald-800 text-emerald-200' : 'bg-rose-950 border-rose-800 text-rose-200'
          }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <input
          type="text"
          placeholder="🔍 Buscar por título ou autor..."
          value={buscaTexto}
          onChange={(e) => { setBuscaTexto(e.target.value); setPage(0); }}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        />

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-medium">
          {(['ALL', 'livro', 'jogo', 'manga', 'quadrinho'] as const).map((tipo) => (
            <button
              key={tipo}
              onClick={() => { setMediaTypeFilter(tipo); setPage(0); }}
              className={`px-3 py-1.5 rounded-full capitalize whitespace-nowrap transition-colors border ${mediaTypeFilter === tipo
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
            >
              {tipo === 'ALL' ? '🌎 Todos' : tipo}
            </button>
          ))}
        </div>
      </div>

      {loadingItems ? (
        <div className="py-20 text-center space-y-2">
          <Loader className="animate-spin mx-auto text-indigo-500" size={32} />
          <p className="text-xs text-slate-400">Atualizando acervo...</p>
        </div>
      ) : itensPaginados.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
          <BookOpen className="mx-auto text-slate-600 mb-2" size={32} />
          <p className="text-sm font-medium text-slate-400">Nenhum item localizado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {itensPaginados.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl flex gap-3 relative shadow-md">
              <div className="w-16 h-24 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-700">
                {item.capa_url ? (
                  <img src={item.capa_url} alt={item.titulo} className="w-full h-full object-cover" />
                ) : item.categoria === 'jogo' ? (
                  <Gamepad2 className="text-slate-500" size={20} />
                ) : (
                  <BookOpen className="text-slate-500" size={20} />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h3 className="font-bold text-sm text-white truncate pr-6">{item.titulo}</h3>
                    <button
                      onClick={() => item.id && handleDeleteItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1 absolute top-2 right-2"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate">
                    {item.categoria === 'jogo' ? item.especificos?.plataforma : item.especificos?.autor}
                  </p>

                  {item.categoria === 'manga' && item.especificos?.volume_atual && (
                    <span className="inline-block mt-1 text-[10px] bg-slate-800 border border-slate-700 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                      Vol. {item.especificos.volume_atual} / {item.especificos.total_volumes || '?'}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] mt-2 pt-1 border-t border-slate-800/50">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                    {item.status}
                  </span>
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: item.nota || 0 }).map((_, i) => (
                      <Star key={i} size={10} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seção de Paginação Corrigida e Formatada */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-slate-400 font-medium">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Anterior
          </button>

          <span>Página {page + 1} de {totalPages}</span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40"
          >
            Próximo <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
