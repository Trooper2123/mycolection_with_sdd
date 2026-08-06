import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // IMPORTANTE: Adicionado para o Firestore
import { auth, db, isFirebaseConfigured } from './firebase'; // IMPORTANTE: Certifique-se de que 'db' está exportado em './firebase'
import { Auth } from './components/Auth';
import { Collection } from './components/Collection';
import { MediaForm } from './components/MediaForm'; // IMPORTANTE: Adicionado seu formulário .tsx
import { CategoriaMidia, StatusMidia, DetalhesEspecificos } from './types/media'; // IMPORTANTE: Adicionado os tipos
import { Loader, AlertTriangle, Plus, List } from 'lucide-react'; // IMPORTANTE: Adicionado ícones Plus e List para navegação móvel

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'ver' | 'adicionar'>('ver'); // Controle de tela pessoal no celular
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- FUNÇÃO PARA CONECTAR O ONSALVAR AO FIRESTORE ---
  const handleSalvarNoFirestore = async (dadosFormulario: {
    titulo: string;
    categoria: CategoriaMidia;
    status: StatusMidia;
    nota: number;
    especificos: DetalhesEspecificos;
    capa_url?: string;
  }) => {
    if (!user) {
      alert("Erro: Você precisa estar autenticado para salvar itens.");
      return;
    }

    setSalvando(true);

    try {
      const colecaoMidias = collection(db, "midias");

      await addDoc(colecaoMidias, {
        uid_usuario: user.uid, // Usa o UID injetado pelo estado 'user' do Auth
        titulo: dadosFormulario.titulo,
        categoria: dadosFormulario.categoria,
        status: dadosFormulario.status,
        nota: dadosFormulario.nota,
        capa_url: dadosFormulario.capa_url || "",
        especificos: dadosFormulario.especificos,
        data_adicionado: serverTimestamp() // Carimbo de data seguro da Google
      });

      alert("Item adicionado com sucesso!");
      setAbaAtiva('ver'); // Volta automaticamente para a listagem após salvar com sucesso
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
      alert("Houve um erro técnico ao salvar na nuvem.");
    } finally {
      setSalvando(false);
    }
  };
  // --- CARREGANDO ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-gradient-brand">
        <div className="text-center space-y-4">
          <Loader className="animate-spin text-brand-500 mx-auto" size={40} />
          <p className="text-sm text-slate-400 font-medium">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  // --- RENDERING TELA ATIVA (USUÁRIO LOGADO) ---
  if (user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20">
        {/* Loader de Sincronização do Banco de Dados */}
        {salvando && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3 shadow-2xl">
              <Loader className="animate-spin text-indigo-500" size={20} />
              <p className="text-sm font-medium">Salvando na nuvem...</p>
            </div>
          </div>
        )}

        {/* Conteúdo Dinâmico com base na Aba Selecionada */}
        <main className="flex-1 w-full max-w-4xl mx-auto p-4">
          {abaAtiva === 'ver' ? (
            <Collection user={user} />
          ) : (
            <div className="pt-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Novo Item</h2>
                <p className="text-xs text-slate-400">Insira as informações do seu livro, jogo ou mangá</p>
              </div>
              <MediaForm onSalvar={handleSalvarNoFirestore} />
            </div>
          )}
        </main>

        {/* Menu Inferior Fixo estilo Aplicativo Mobile para Celular */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur border-t border-slate-800 flex justify-around items-center z-40 px-6">
          <button
            onClick={() => setAbaAtiva('ver')}
            className={`flex flex-col items-center gap-1 transition-colors ${abaAtiva === 'ver' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <List size={22} />
            <span className="text-[10px] font-bold">Minha Coleção</span>
          </button>

          <button
            onClick={() => setAbaAtiva('adicionar')}
            className={`flex flex-col items-center gap-1 transition-colors ${abaAtiva === 'adicionar' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Plus size={22} />
            <span className="text-[10px] font-bold">Adicionar</span>
          </button>
        </nav>
      </div>
    );
  }

  // --- USUÁRIO NÃO LOGADO ---
  return <Auth />;
};

export default App;
