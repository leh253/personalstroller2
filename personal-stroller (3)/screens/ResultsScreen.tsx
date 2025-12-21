import React from 'react';
import { RefreshCw, ExternalLink, ArrowLeft, LogOut } from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { recordProductClick } from '../strollerService';
import { Stroller } from '../types';

interface Props {
  results: Stroller[];
  onRestart: () => void;
  onBack: () => void;
  onLogout: () => void;
}

const ResultsScreen: React.FC<Props> = ({ results, onRestart, onBack, onLogout }) => {
  return (
    <div className="flex-1 flex flex-col w-full animate-in bg-[#151b2b]">
      {/* Navbar */}
      <div className="sticky top-0 z-30 p-4 md:p-6 bg-[#151b2b]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <Logo size="small" />
        <button onClick={onLogout} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
          <LogOut size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Votre Sélection Idéale</h2>
            <p className="text-slate-400">{results.length} poussette(s) correspondent à vos besoins</p>
          </header>

          {results.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl">
              <p className="text-xl text-slate-300 mb-6">Aucun modèle ne correspond exactement à tous vos critères.</p>
              <Button variant="primary" onClick={onRestart} className="max-w-xs mx-auto">
                Modifier mes réponses
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((stroller, idx) => (
                <div key={idx} className="glass-card rounded-[2rem] overflow-hidden flex flex-col group">
                  <div className="bg-white p-6 h-64 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={stroller.url_image || "https://via.placeholder.com/400?text=Poussette"} 
                      alt={stroller.modele}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400?text=Image+Indisponible")}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <span className="text-[#c5a065] font-bold text-xs tracking-widest uppercase">{stroller.marque}</span>
                      <h3 className="text-xl font-bold text-white mt-1 leading-tight">{stroller.modele}</h3>
                    </div>
                    
                    <div className="mt-auto space-y-3">
                      <a 
                        href={stroller['site web'] || stroller.url_produit || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => recordProductClick(stroller)}
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-[#c5a065] to-[#b08d55] text-white font-bold rounded-xl shadow-lg shadow-[#c5a065]/10 hover:shadow-[#c5a065]/20 transition-all active:scale-95"
                      >
                        VOIR L'OFFRE <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <footer className="mt-20 mb-10 flex flex-col items-center gap-6">
            <Button variant="outline" onClick={onRestart} className="max-w-xs">
              <RefreshCw size={18} className="mr-2" /> Recommencer le quiz
            </Button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;