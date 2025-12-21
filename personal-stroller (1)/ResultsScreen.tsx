import React, { useState } from 'react';
import { RefreshCw, ExternalLink, ArrowLeft, LogOut, Trash2 } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import { recordProductClick, deleteUserAccountData } from './strollerService';
import { Stroller } from './types';

interface Props {
  results: Stroller[];
  onRestart: () => void;
  onBack: () => void;
  onLogout: () => void;
}

const ResultsScreen: React.FC<Props> = ({ results, onRestart, onBack, onLogout }) => {
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Supprimer définitivement votre compte et vos données ?")) {
      await deleteUserAccountData();
      onLogout();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-navy-900 min-h-screen">
      <nav className="p-4 border-b border-white/5 sticky top-0 bg-navy-900/90 backdrop-blur-md z-50 flex items-center justify-between">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={20}/></button>
        <Logo size="small" />
        <button onClick={onLogout} className="p-2 text-slate-400 hover:text-white transition-colors"><LogOut size={20}/></button>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Votre Sélection Sur-Mesure</h2>
          <p className="text-gold-400 text-xs tracking-widest uppercase font-bold opacity-60">
            {results.length} modèle(s) trouvé(s) pour votre style de vie
          </p>
        </header>

        {results.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-[2rem] max-w-lg mx-auto">
            <p className="text-slate-400 mb-8 px-4 font-light">Nous n'avons pas trouvé de correspondance exacte. Essayez de modifier quelques critères.</p>
            <Button variant="primary" onClick={onRestart} className="max-w-xs mx-auto">Ajuster mes réponses</Button>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((s, i) => (
              <div key={i} className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col group transition-all duration-500 hover:border-gold-400/40 hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-1">
                <div className="bg-white p-8 h-64 flex items-center justify-center relative overflow-hidden">
                  <img src={s.url_image} alt={s.modele} className="max-h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-navy-900 text-gold-400 text-[8px] font-bold px-3 py-1 rounded-full border border-gold-400/20 uppercase tracking-widest">Recommandé</div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-gold-400 text-[9px] font-black tracking-[0.3em] uppercase mb-1">{s.marque}</span>
                  <h3 className="text-2xl font-bold mb-8 text-white">{s.modele}</h3>
                  <a 
                    href={s['site web'] || s.url_produit} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => recordProductClick(s)}
                    className="mt-auto w-full py-4 bg-gradient-to-r from-gold-400 to-gold-600 rounded-2xl text-center font-bold text-xs tracking-[0.2em] text-white shadow-xl flex items-center justify-center gap-3 uppercase transition-all hover:gap-5"
                  >
                    DÉCOUVRIR L'OFFRE <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <footer className="mt-24 border-t border-white/5 pt-12 flex flex-col items-center gap-12">
          <button onClick={onRestart} className="flex items-center gap-3 text-gold-400 font-bold text-[10px] tracking-widest uppercase bg-white/5 px-8 py-4 rounded-full border border-white/5 hover:bg-white/10 transition-all">
            <RefreshCw size={16} /> RECOMMENCER LE TEST
          </button>
          
          <button onClick={handleDelete} className="text-red-900/40 hover:text-red-500 text-[9px] uppercase tracking-widest flex items-center gap-2 transition-colors">
            <Trash2 size={12}/> Supprimer mes données de profil
          </button>
        </footer>
      </main>
    </div>
  );
};
export default ResultsScreen;