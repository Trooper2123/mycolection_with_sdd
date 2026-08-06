import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Library, LogIn, UserPlus, AlertCircle, Loader } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      switch (err.code) {
        case 'auth/invalid-email':
          setError('O formato do e-mail inserido é inválido.');
          break;
        case 'auth/user-disabled':
          setError('Esta conta de usuário foi desativada.');
          break;
        case 'auth/user-not-found':
          setError('Nenhum usuário encontrado com este e-mail.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta. Tente novamente.');
          break;
        case 'auth/email-already-in-use':
          setError('Este endereço de e-mail já está sendo utilizado.');
          break;
        case 'auth/weak-password':
          setError('A senha inserida é muito fraca. Digite ao menos 6 caracteres.');
          break;
        default:
          setError('Erro ao autenticar. Verifique sua conexão e dados informados.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-gradient-brand p-4">
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 relative overflow-hidden shadow-2xl transition-all duration-300">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-xl -mr-8 -mt-8" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-600/10 rounded-full blur-2xl -ml-12 -mb-12" />

        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-brand-500/10 border border-brand-500/30 rounded-2xl text-brand-400 mb-4 animate-pulse">
            <Library size={36} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">MyColection</h1>
          <p className="text-sm text-slate-400">
            {isSignUp ? 'Crie sua conta para começar' : 'Acesse seu acervo pessoal e compartilhado'}
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-950/40 border border-red-800/50 text-red-200 p-3 rounded-lg text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full glass-input"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full glass-input"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200 mt-6 cursor-pointer"
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : isSignUp ? (
              <>
                <UserPlus size={20} />
                <span>Criar Conta</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
          <p className="text-sm text-slate-400">
            {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="ml-1.5 text-brand-400 hover:text-brand-300 font-semibold underline focus:outline-none cursor-pointer"
            >
              {isSignUp ? 'Fazer Login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
