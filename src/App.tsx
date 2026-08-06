import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';
import { Auth } from './components/Auth';
import { Collection } from './components/Collection';
import { Loader, AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  // --- SE O FIREBASE NÃO ESTIVER CONFIGURADO NO .env ---
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-gradient-brand p-4">
        <div className="w-full max-w-lg glass-panel rounded-2xl p-8 relative overflow-hidden shadow-2xl space-y-6">
          <div className="flex items-center gap-3 text-yellow-500 bg-yellow-950/20 border border-yellow-800/30 p-3 rounded-xl">
            <AlertTriangle className="shrink-0" size={24} />
            <div>
              <h2 className="font-bold text-white text-sm">Configuração Pendente</h2>
              <p className="text-xs text-yellow-200/80">O Firebase não foi configurado corretamente.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight text-white">Configurando o MyColection</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Para utilizar a aplicação, você precisa conectar seu projeto do Firebase. Siga os passos abaixo:
            </p>

            <div className="space-y-3">
              <div className="flex gap-3 text-xs leading-relaxed text-slate-300">
                <div className="flex-none p-1 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-lg h-7 w-7 flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-bold text-white mb-0.5">Criar arquivo `.env`</p>
                  <p>Copie o arquivo <span className="font-mono bg-slate-900 px-1 py-0.5 rounded text-brand-300">.env.example</span> na raiz do projeto e renomeie-o para <span className="font-mono bg-slate-900 px-1 py-0.5 rounded text-brand-300">.env</span>.</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs leading-relaxed text-slate-300">
                <div className="flex-none p-1 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-lg h-7 w-7 flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-bold text-white mb-0.5">Obter credenciais do Firebase</p>
                  <p>No console do Firebase, crie um aplicativo Web e copie as configurações (apiKey, authDomain, projectId, etc.).</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs leading-relaxed text-slate-300">
                <div className="flex-none p-1 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-lg h-7 w-7 flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="font-bold text-white mb-0.5">Preencher as variáveis no arquivo `.env`</p>
                  <pre className="mt-1.5 p-3 bg-slate-950/80 border border-slate-900 rounded-lg text-[10px] text-slate-400 font-mono overflow-x-auto">
{`VITE_FIREBASE_API_KEY=seu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain_aqui
VITE_FIREBASE_PROJECT_ID=seu_project_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id_aqui
VITE_FIREBASE_APP_ID=seu_app_id_aqui`}
                  </pre>
                </div>
              </div>

              <div className="flex gap-3 text-xs leading-relaxed text-slate-300">
                <div className="flex-none p-1 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-lg h-7 w-7 flex items-center justify-center font-bold">4</div>
                <div>
                  <p className="font-bold text-white mb-0.5">Reiniciar servidor</p>
                  <p>Pare o terminal atual e execute novamente <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-brand-300">npm run dev</span>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  // --- RENDERING TELA ATIVA ---
  return user ? <Collection user={user} /> : <Auth />;
};
export default App;
