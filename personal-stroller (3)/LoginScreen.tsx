
import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from './supabase.ts';
import InputField from './InputField.tsx';
import Button from './Button.tsx';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const LoginScreen: React.FC<Props> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) return setErrorMsg("Veuillez remplir tous les champs");
    
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) throw error;
      if (data.session) onSuccess();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col bg-navy-900 min-h-screen">
      <div className="p-6 bg-navy-900/90 backdrop-blur-xl z-20 flex items-center shrink-0 border-b border-white/5 sticky top-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white mr-4 transition-colors p-2 hover:bg-white/5 rounded-full z-20">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-gold-400 font-bold text-xs tracking-[0.2em] uppercase">Connexion</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center p-8 animate-in">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-light text-white mb-2 tracking-tight">Bon retour</h2>
            <p className="text-gray-400 font-light text-sm">Accédez à votre profil expert</p>
          </div>

          <form onSubmit={handleLogin} className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-2xl relative">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs animate-in">
                <AlertCircle size={16} className="shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <InputField icon={Mail} type="email" placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField icon={Lock} type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div className="mt-8">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
