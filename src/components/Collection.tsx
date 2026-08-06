import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Item, Share, TipoMidia, getStatusEmprestimo, getLabelTipoMidia } from '../types';
import { 
  Plus, Edit2, Trash2, Share2, 
  AlertTriangle, Filter, LogOut, Users, BookOpen, Gamepad2, 
  Layers, Loader, ShieldAlert, ChevronLeft, ChevronRight, X, Scroll
} from 'lucide-react';

interface CollectionProps {
  user: User;
}

export const Collection: React.FC<CollectionProps> = ({ user }) => {
  // --- Estados de Compartilhamento/Espaços ---
  const [activeSpace, setActiveSpace] = useState<'mine' | string>('mine'); // 'mine' ou o ownerId compartilhado
  const [myShares, setMyShares] = useState<Share[]>([]); // pessoas com quem compartilhei meu acervo
  const [sharedWithMe, setSharedWithMe] = useState<Share[]>([]); // acervos compartilhados comigo
  const [activePermission, setActivePermission] = useState<'owner' | 'editor' | 'viewer'>('owner');

  // --- Estados do Acervo ---
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<TipoMidia | 'ALL'>('ALL');
  
  // --- Estados de Paginação ---
  const [page, setPage] = useState(0);
  const itemsPerPage = 8;

  // --- Estados de Feedback e Modais ---
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // --- Formulário de Item ---
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [tipoMidia, setTipoMidia] = useState<TipoMidia>('LIVRO');
  const [categoriasInput, setCategoriasInput] = useState('');
  const [consoleInput, setConsoleInput] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tags, setTags] = useState('');

  // --- Formulário de Compartilhamento ---
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<'editor' | 'viewer'>('viewer');
  const [submittingShare, setSubmittingShare] = useState(false);

  // --- Efeito: Monitora compartilhamentos ---
  useEffect(() => {
    if (!db || !user) return;

    // 1. Monitorar quem tem acesso ao meu acervo (para exibir na aba de compartilhamento)
    const qMyShares = query(collection(db, 'shares'), where('ownerId', '==', user.uid));
    const unsubMyShares = onSnapshot(qMyShares, (snapshot) => {
      const sharesList: Share[] = [];
      snapshot.forEach((doc) => {
        sharesList.push({ id: doc.id, ...doc.data() } as Share);
      });
      setMyShares(sharesList);
    });

    // 2. Monitorar acervos compartilhados comigo (para preencher o seletor de espaços)
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
    setPage(0); // Volta para primeira página ao trocar de espaço
  }, [activeSpace, sharedWithMe]);

  // --- Efeito: Carrega itens em tempo real do espaço ativo ---
  useEffect(() => {
    if (!db || !user) return;

    setLoadingItems(true);
    const targetOwnerId = activeSpace === 'mine' ? user.uid : activeSpace;
    
    const qItems = query(
      collection(db, 'items'),
      where('ownerId', '==', targetOwnerId)
    );

    const unsubItems = onSnapshot(qItems, (snapshot) => {
      const itemsList: Item[] = [];
      snapshot.forEach((doc) => {
        itemsList.push({ id: doc.id, ...doc.data() } as Item);
      });
      setItems(itemsList);
      setLoadingItems(false);
    }, (error) => {
      console.error("Erro ao escutar itens:", error);
      showFeedback('Sem permissão para ler os itens deste acervo.', 'error');
      setLoadingItems(false);
    });

    return () => unsubItems();
  }, [activeSpace, user]);

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // --- Métodos de Item (Cadastro / Edição) ---
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activePermission === 'viewer') {
      showFeedback('Apenas leitores não podem editar o acervo.', 'error');
      return;
    }

    if (!nome.trim()) {
      showFeedback('O nome do item é obrigatório.', 'error');
      return;
    }

    if (!categoriasInput.trim()) {
      showFeedback('Pelo menos uma categoria é obrigatória.', 'error');
      return;
    }

    if (tipoMidia === 'JOGO' && !consoleInput.trim()) {
      showFeedback('O campo console é obrigatório para jogos.', 'error');
      return;
    }

    const categorias = categoriasInput
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const targetOwnerId = activeSpace === 'mine' ? user.uid : activeSpace;
    const targetOwnerEmail = activeSpace === 'mine' ? (user.email || '') : (sharedWithMe.find(s => s.ownerId === activeSpace)?.ownerEmail || '');

    // Firestore SDK v10 rejeita valores `undefined` — usar null para campos opcionais vazios
    const existingItem = isEditing && editingId ? items.find(i => i.id === editingId) : null;

    const payload: Omit<Item, 'id'> = {
      nome: nome.trim(),
      tipoMidia,
      categorias,
      descricao: descricao.trim() || null,
      tags: tags.trim() || null,
      console: tipoMidia === 'JOGO' ? consoleInput.trim() : null,
      dataRetirada: existingItem ? (existingItem.dataRetirada ?? null) : null,
      dataDevolucao: existingItem ? (existingItem.dataDevolucao ?? null) : null,
      perdido: existingItem ? existingItem.perdido : false,
      justificativaPerda: existingItem ? (existingItem.justificativaPerda ?? null) : null,
      ownerId: targetOwnerId,
      ownerEmail: targetOwnerEmail
    };

    try {
      if (isEditing && editingId) {
        await updateDoc(doc(db, 'items', editingId), payload);
        showFeedback('Item atualizado com sucesso.', 'success');
      } else {
        await addDoc(collection(db, 'items'), payload);
        showFeedback('Item cadastrado com sucesso.', 'success');
      }
      resetForm();
    } catch (err: any) {
      console.error('Erro ao salvar item:', err?.code, err?.message, err);
      const msg = err?.code === 'permission-denied'
        ? 'Permissão negada pelo Firestore. Verifique as regras de segurança.'
        : `Erro ao salvar item: ${err?.message ?? 'Erro desconhecido'}`;
      showFeedback(msg, 'error');
    }
  };

  const handleEditClick = (item: Item) => {
    setIsEditing(true);
    setEditingId(item.id || null);
    setNome(item.nome);
    setTipoMidia(item.tipoMidia);
    setCategoriasInput(item.categorias.join(', '));
    setConsoleInput(item.console || '');
    setDescricao(item.descricao || '');
    setTags(item.tags || '');
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setNome('');
    setTipoMidia('LIVRO');
    setCategoriasInput('');
    setConsoleInput('');
    setDescricao('');
    setTags('');
  };

  // --- Métodos de Item (Empréstimo / Devolução / Exclusão) ---
  const handleEmprestar = async (item: Item) => {
    if (activePermission === 'viewer') return;
    if (item.perdido) {
      showFeedback('Itens marcados como perdidos não podem ser emprestados.', 'error');
      return;
    }
    if (item.dataRetirada) {
      showFeedback('O item já está emprestado.', 'error');
      return;
    }

    const now = new Date();
    const returnDate = new Date();
    returnDate.setMonth(now.getMonth() + 1);

    try {
      await updateDoc(doc(db, 'items', item.id!), {
        dataRetirada: now.toISOString().split('T')[0],
        dataDevolucao: returnDate.toISOString().split('T')[0]
      });
      showFeedback(`Empréstimo de "${item.nome}" registrado com sucesso.`, 'success');
    } catch (err) {
      showFeedback('Erro ao registrar empréstimo.', 'error');
    }
  };

  const handleDevolver = async (item: Item) => {
    if (activePermission === 'viewer') return;
    try {
      await updateDoc(doc(db, 'items', item.id!), {
        dataRetirada: null,
        dataDevolucao: null
      });
      showFeedback(`Devolução de "${item.nome}" registrada com sucesso.`, 'success');
    } catch (err) {
      showFeedback('Erro ao registrar devolução.', 'error');
    }
  };

  const handleDeleteItem = async (item: Item) => {
    if (activePermission === 'viewer') return;
    const isLent = Boolean(item.dataRetirada || item.dataDevolucao);

    if (isLent) {
      const justificativa = window.prompt(
        'Este item está emprestado! Para excluí-lo, ele será marcado como PERDIDO. Informe uma justificativa:'
      );
      if (justificativa === null) return; // cancelado
      if (!justificativa.trim()) {
        showFeedback('A justificativa é obrigatória para marcar o item como perdido.', 'error');
        return;
      }

      try {
        await updateDoc(doc(db, 'items', item.id!), {
          perdido: true,
          justificativaPerda: justificativa.trim(),
          dataRetirada: null,
          dataDevolucao: null
        });
        showFeedback(`Item "${item.nome}" marcado como perdido.`, 'success');
      } catch (err) {
        showFeedback('Erro ao atualizar item para perdido.', 'error');
      }
    } else {
      if (window.confirm(`Tem certeza de que deseja remover permanentemente o item "${item.nome}"?`)) {
        try {
          await deleteDoc(doc(db, 'items', item.id!));
          showFeedback(`Item "${item.nome}" removido do acervo.`, 'success');
        } catch (err) {
          showFeedback('Erro ao remover item.', 'error');
        }
      }
    }
  };

  // --- Métodos de Compartilhamento ---
  const handleAddShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;
    
    const emailToShare = shareEmail.trim().toLowerCase();
    if (emailToShare === user.email?.toLowerCase()) {
      showFeedback('Você não pode compartilhar o acervo consigo mesmo.', 'error');
      return;
    }

    setSubmittingShare(true);
    try {
      // Document ID determinístico: colaboratoremail_owneruid
      const shareId = `${emailToShare}_${user.uid}`;
      await setDoc(doc(db, 'shares', shareId), {
        ownerId: user.uid,
        ownerEmail: user.email || '',
        collaboratorEmail: emailToShare,
        role: shareRole
      });
      showFeedback(`Acesso concedido com sucesso para ${emailToShare}.`, 'success');
      setShareEmail('');
    } catch (err) {
      console.error(err);
      showFeedback('Erro ao compartilhar acervo.', 'error');
    } finally {
      setSubmittingShare(false);
    }
  };

  const handleRevokeShare = async (share: Share) => {
    if (window.confirm(`Revogar acesso de ${share.collaboratorEmail}?`)) {
      try {
        const shareId = `${share.collaboratorEmail}_${user.uid}`;
        await deleteDoc(doc(db, 'shares', shareId));
        showFeedback('Acesso revogado com sucesso.', 'success');
      } catch (err) {
        showFeedback('Erro ao revogar acesso.', 'error');
      }
    }
  };

  // --- Lógica de Filtro e Paginação ---
  const filteredItems = items.filter(item => {
    const matchesCategory = categoryFilter.trim() === '' || 
      item.categorias.some(cat => cat.toLowerCase().includes(categoryFilter.toLowerCase()));
    const matchesMedia = mediaTypeFilter === 'ALL' || item.tipoMidia === mediaTypeFilter;
    return matchesCategory && matchesMedia;
  });

  const totalPages = Math.max(Math.ceil(filteredItems.length / itemsPerPage), 1);
  const pagedItems = filteredItems.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handlePrevPage = () => setPage(p => Math.max(0, p - 1));
  const handleNextPage = () => setPage(p => Math.min(totalPages - 1, p + 1));

  // --- Ícones auxiliares de Mídia ---
  const renderMediaIcon = (type: TipoMidia) => {
    switch (type) {
      case 'LIVRO': return <BookOpen className="text-emerald-400" size={18} />;
      case 'JOGO': return <Gamepad2 className="text-blue-400" size={18} />;
      case 'QUADRINHO': return <Layers className="text-yellow-400" size={18} />;
      case 'MANGA': return <Scroll className="text-orange-400" size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-brand pb-12">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-400">
              <Layers size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">MyColection</h1>
              <p className="text-xs text-slate-400">Gerenciador de Acervos Moderno</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            {/* Seletor de Espaço de Trabalho */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:inline">Espaço:</span>
              <select
                value={activeSpace}
                onChange={(e) => setActiveSpace(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="mine">Meu Acervo (Dono)</option>
                {sharedWithMe.map(share => (
                  <option key={share.ownerId} value={share.ownerId}>
                    Acervo de {share.ownerEmail} ({share.role === 'editor' ? 'Editor' : 'Leitor'})
                  </option>
                ))}
              </select>
            </div>

            <div className="h-6 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-medium text-slate-300">{user.email}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{activePermission === 'owner' ? 'Proprietário' : activePermission}</p>
              </div>
              <button
                onClick={() => auth.signOut()}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: LISTA & FILTROS (2 Colunas no desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {message && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
              message.type === 'success' 
                ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200' 
                : 'bg-red-950/30 border-red-800/40 text-red-200'
            }`}>
              <AlertTriangle className="shrink-0 mt-0.5" size={18} />
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          {/* FILTROS CARD */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Filter size={18} />
                <span>Filtros do Acervo</span>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setMediaTypeFilter('ALL')}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                    mediaTypeFilter === 'ALL' 
                      ? 'bg-brand-600 border-brand-500 text-white' 
                      : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Todos
                </button>
                {(['LIVRO', 'QUADRINHO', 'MANGA', 'JOGO'] as TipoMidia[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setMediaTypeFilter(type)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                      mediaTypeFilter === type 
                        ? 'bg-brand-600 border-brand-500 text-white' 
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {getLabelTipoMidia(type)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <input
                type="text"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
                placeholder="Buscar por categoria (ex: Ficção, Aventura, RPG)..."
                className="w-full glass-input"
              />
            </div>
          </div>

          {/* LISTAGEM CARD */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-900/60 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Lista de Itens</h2>
                <p className="text-xs text-slate-400">Total de {filteredItems.length} itens encontrados</p>
              </div>
              
              {activePermission === 'viewer' && (
                <div className="flex items-center gap-1.5 text-xs text-yellow-500 bg-yellow-950/20 border border-yellow-800/30 px-2 py-1 rounded-lg">
                  <ShieldAlert size={14} />
                  <span>Modo Leitura</span>
                </div>
              )}
            </div>

            {loadingItems ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader className="animate-spin text-brand-500" size={32} />
                <span className="text-sm">Buscando acervo na nuvem...</span>
              </div>
            ) : pagedItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Layers className="mx-auto mb-4 opacity-20" size={48} />
                <p className="text-sm font-medium">Nenhum item cadastrado neste acervo ou correspondente aos filtros.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-900/50">
                {pagedItems.map((item) => {
                  const status = getStatusEmprestimo(item);
                  return (
                    <div key={item.id} className="p-6 hover:bg-slate-900/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {renderMediaIcon(item.tipoMidia)}
                          <span className="font-bold text-white text-base tracking-tight">{item.nome}</span>
                          {item.console && (
                            <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                              {item.console}
                            </span>
                          )}
                        </div>

                        {item.descricao && (
                          <p className="text-sm text-slate-400 line-clamp-2 max-w-lg">{item.descricao}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-slate-500 font-medium">Categorias:</span>
                          {item.categorias.map((cat, idx) => (
                            <span key={idx} className="bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full">
                              {cat}
                            </span>
                          ))}
                          
                          {item.tags && (
                            <>
                              <span className="text-slate-600 font-semibold ml-2">#</span>
                              <span className="text-slate-500 italic">{item.tags}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* AÇÕES E STATUS */}
                      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center justify-end gap-4 shrink-0">
                        {/* Status do Empréstimo */}
                        <div className="text-left sm:text-right md:text-left lg:text-right">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            status === 'Disponível'
                              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400'
                              : status === 'Emprestado'
                              ? 'bg-blue-950/20 border-blue-800/40 text-blue-400'
                              : 'bg-red-950/20 border-red-800/40 text-red-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === 'Disponível' ? 'bg-emerald-400' : status === 'Emprestado' ? 'bg-blue-400' : 'bg-red-400'
                            }`} />
                            {status}
                          </span>
                          
                          {status === 'Emprestado' && (
                            <p className="text-[10px] text-slate-500 mt-1">Devolução: {item.dataDevolucao}</p>
                          )}
                          {status === 'Perdido' && item.justificativaPerda && (
                            <p className="text-[10px] text-red-400 mt-1 max-w-[200px] truncate" title={item.justificativaPerda}>
                              Motivo: {item.justificativaPerda}
                            </p>
                          )}
                        </div>

                        {/* Botões de Ações (Ocultos para visualizadores) */}
                        {activePermission !== 'viewer' && (
                          <div className="flex gap-2">
                            {status === 'Disponível' && (
                              <button
                                onClick={() => handleEmprestar(item)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-brand-950 hover:text-brand-300 text-slate-300 border border-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                              >
                                Emprestar
                              </button>
                            )}

                            {status === 'Emprestado' && (
                              <button
                                onClick={() => handleDevolver(item)}
                                className="px-3 py-1.5 bg-brand-900/20 hover:bg-brand-900 text-brand-300 border border-brand-800/40 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                              >
                                Devolver
                              </button>
                            )}

                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="p-1.5 bg-slate-900 hover:bg-red-950 hover:text-red-400 text-slate-400 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                              title={status === 'Emprestado' ? 'Marcar como perdido' : 'Excluir'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PAGINAÇÃO */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-900/60 flex items-center justify-between">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 0}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-50 disabled:hover:text-slate-400 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Anterior
                </button>
                <span className="text-xs text-slate-400">Página {page + 1} de {totalPages}</span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages - 1}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-50 disabled:hover:text-slate-400 cursor-pointer flex items-center gap-1"
                >
                  Próxima <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA: FORMULÁRIO DE CADASTRO & PAINEL DE COMPARTILHAMENTO */}
        <div className="space-y-6">
          
          {/* PAINEL DE CADASTRO / EDIÇÃO */}
          {activePermission !== 'viewer' ? (
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                  {isEditing ? 'Editar Item' : 'Novo Item'}
                </h2>
                {isEditing && (
                  <button 
                    onClick={resetForm}
                    className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nome do Item
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Título da obra ou do jogo"
                    className="w-full glass-input text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Tipo de Mídia
                    </label>
                    <select
                      value={tipoMidia}
                      onChange={(e) => {
                        const newType = e.target.value as TipoMidia;
                        setTipoMidia(newType);
                        if (newType !== 'JOGO') setConsoleInput('');
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
                    >
                      <option value="LIVRO">Livro</option>
                      <option value="QUADRINHO">Quadrinho</option>
                      <option value="MANGA">Mangá</option>
                      <option value="JOGO">Jogo</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                      tipoMidia === 'JOGO' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Console {tipoMidia === 'JOGO' && '*'}
                    </label>
                    <input
                      type="text"
                      value={consoleInput}
                      onChange={(e) => setConsoleInput(e.target.value)}
                      disabled={tipoMidia !== 'JOGO'}
                      placeholder={tipoMidia === 'JOGO' ? 'PS5, PC, Switch' : 'Apenas para jogos'}
                      className="w-full glass-input text-sm disabled:opacity-30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Categorias (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={categoriasInput}
                    onChange={(e) => setCategoriasInput(e.target.value)}
                    placeholder="Fantasia, RPG, Romance"
                    className="w-full glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Descrição
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Breve descrição ou observações do item"
                    rows={2}
                    className="w-full glass-input text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="ex: raro, emprestado-mae"
                    className="w-full glass-input text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer mt-4"
                >
                  <Plus size={18} />
                  <span>{isEditing ? 'Salvar Alterações' : 'Criar Item'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 text-center text-slate-400 space-y-3">
              <ShieldAlert className="mx-auto text-yellow-500 opacity-60" size={32} />
              <h3 className="font-bold text-white text-sm">Visualização Protegida</h3>
              <p className="text-xs">Você está navegando no acervo de outro usuário como leitor. A adição, edição ou exclusão de itens está desativada.</p>
            </div>
          )}

          {/* PAINEL DE COMPARTILHAMENTO (Disponível apenas no "Meu Acervo") */}
          {activeSpace === 'mine' && (
            <div className="glass-panel rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 text-slate-200">
                <Share2 className="text-brand-400" size={18} />
                <h2 className="text-base font-bold">Compartilhar meu Acervo</h2>
              </div>

              <form onSubmit={handleAddShare} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    E-mail do Colaborador
                  </label>
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="colaborador@email.com"
                    className="w-full glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nível de Permissão
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShareRole('viewer')}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        shareRole === 'viewer'
                          ? 'bg-slate-900 border-brand-500 text-brand-400 font-bold'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Leitor (Apenas Vê)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShareRole('editor')}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        shareRole === 'editor'
                          ? 'bg-slate-900 border-brand-500 text-brand-400 font-bold'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Editor (Altera Itens)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingShare}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {submittingShare ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Users size={16} />
                      <span>Conceder Acesso</span>
                    </>
                  )}
                </button>
              </form>

              {/* LISTA DE COLABORADORES ATUAIS */}
              <div className="space-y-3 pt-4 border-t border-slate-900/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quem tem acesso</h3>
                {myShares.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Seu acervo é totalmente privado.</p>
                ) : (
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {myShares.map(share => (
                      <div key={share.id} className="flex items-center justify-between gap-2 p-2 bg-slate-950/40 rounded-lg border border-slate-900">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">{share.collaboratorEmail}</p>
                          <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                            {share.role === 'editor' ? 'Editor' : 'Leitor'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRevokeShare(share)}
                          className="text-slate-500 hover:text-red-400 p-1 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                          title="Revogar Acesso"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
};
