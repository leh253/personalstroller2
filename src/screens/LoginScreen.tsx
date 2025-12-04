import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { supabase } from '../services/supabase';
import InputField from '../components/InputField';
import Button from '../components/Button';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const LoginScreen: React.FC<Props> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return alert("Champs manquants");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onSuccess();
    } catch (error: any) {
      console.error("Login error:", error);
      alert("Erreur connexion: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in bg-transparent select-none">
      <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-y-contain p-8">
        <div className="max-w-md w-full mx-auto flex flex-col justify-center min-h-full">
          <button onClick={onBack} className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-full backdrop-blur-sm border border-transparent hover:border-white/10 z-20"><ArrowLeft /></button>
          <div className="mt-8 mb-10 text-center"><h2 className="text-4xl font-light text-white mb-2 tracking-tight">Bon retour</h2><p className="text-gray-400 font-light">Connectez-vous pour retrouver vos résultats</p></div>
          <div className="glass-panel p-8 rounded-[2rem]">
            <InputField icon={Mail} type="email" placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField icon={Lock} type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="mt-8"><Button variant="primary" onClick={handleLogin} disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</Button></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;