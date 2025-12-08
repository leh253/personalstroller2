import React from 'react';
import { RefreshCw, ExternalLink, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { recordProductClick } from '../services/strollerService';
import { Stroller } from '../types';

interface Props {
  results: Stroller[];
  onRestart: () => void;
  onBack: () => void;
  onLogout: () => void;
}

const ResultsScreen: React.FC<Props> = ({ results, onRestart, onBack, onLogout }) => {

  const handleOfferClick = (stroller: Stroller) => {
    recordProductClick(stroller);
  };

  return (
    <div className="w-full h-full flex flex-col animate-in">
      {/* Header - Glass Effect - Responsive Padding */}
      <div className="p-4 md:p-6 bg-navy-900/40 backdrop-blur-xl z-10 flex flex-col items-center shrink-0 relative border-b border-white/5">
        <button 
          onClick={onBack} 
          className="absolute top-4 left-4 md:top-6 md:left-6 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          aria-label="Retour au quiz"
        >
          <ArrowLeft size={24} />
        </button>
        <Logo size="small" className="md:scale-110 md:mb-2" />
        
        {/* Desktop Only Title */}
        <div className="hidden md:block text-center">
          {/* Removed font-serif */}
          <h2 className="text-xl text-white tracking-widest font-light mt-2 uppercase">Votre Sélection</h2>
          <p className="text-sm text-gray-400 mt-1">{results.length} poussette(s) trouvée(s)</p>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="w-full pb-24 pt-6 md:max-w-7xl md:mx-auto md:p-6">
          
          {results.length === 0 && (
            <div className="text-center mt-20 opacity-70 px-6">
              {/* Removed font-serif */}
              <p className="text-2xl mb-3 text-white font-medium">Aucun résultat exact.</p>
              <p className="text-sm text-gray-400">Nous n'avons pas trouvé de correspondance parfaite. Essayez de modifier un critère.</p>
            </div>
          )}

          {/* 
            RESPONSIVE LAYOUTS 
            We render two different structures based on screen size using Tailwind's 'md:hidden' and 'md:grid'
          */}

          {/* --- MOBILE LAYOUT: Liquid Glass Feed (Visible < 768px) --- */}
          <div className="flex flex-col gap-8 md:hidden">
            {results.map((item, i) => (
              <div key={i} className="mx-5 glass-card rounded-[2.5rem] overflow-hidden relative flex flex-col group transition-transform duration-500">
                
                {/* Image Area - Animated Background */}
                <div className="w-full aspect-[4/5] relative flex items-center justify-center p-8 overflow-hidden bg-navy-900/40">
                  
                  {/* Rotating Spotlight Background */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] animate-spin-slower opacity-60">
                    <div className="w-full h-full bg-[conic-gradient(var(--tw-gradient-stops))] from-transparent via-gold-400/20 to-transparent blur-3xl"></div>
                  </div>
                  {/* Secondary Rotating Light */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] animate-spin-slow opacity-30" style={{ animationDirection: 'reverse' }}>
                      <div className="w-full h-full bg-[conic-gradient(var(--tw-gradient-stops))] from-transparent via-blue-400/10 to-transparent blur-2xl"></div>
                  </div>
                  
                  {/* Light Center Glow */}
                  <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-80"></div>

                  <img 
                    src={item.url_image || "https://via.placeholder.com/600x600?text=Image+Indispo"} 
                    alt={`${item.marque} ${item.modele}`}
                    className="max-h-full max-w-full object-contain drop-shadow-2xl z-10 transform group-hover:scale-105 transition-transform duration-700 ease-out relative" 
                    referrerPolicy="no-referrer"
                    onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x600?text=Image+Indispo"}
                  />
                </div>

                {/* Glass Content Area */}
                <div className="px-6 pb-6 pt-4 flex-1 flex flex-col bg-navy-900/40 backdrop-blur-xl border-t border-white/5 relative z-20">
                  <div className="mb-4">
                    {/* Removed font-serif */}
                    <h3 className="text-gold-400 font-bold tracking-[0.2em] text-sm uppercase mb-1 opacity-90">{item.marque}</h3>
                    <h2 className="text-3xl font-bold text-white leading-tight">{item.Modele || item.modele}</h2>
                  </div>

                  {/* Action Button */}
                  <a 
                    href={item['site web'] || item.url_produit || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => handleOfferClick(item)}
                    className="mt-auto block w-full py-4 bg-white text-navy-900 text-center font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Voir l'offre <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* --- DESKTOP LAYOUT: Glass Grid (Visible >= 768px) --- */}
          <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-8">
            {results.map((item, i) => (
              <div key={i} className="glass-card p-5 rounded-3xl relative flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:border-white/20 group overflow-hidden">
                  {/* Animated Background Container */}
                  <div className="h-64 w-full flex items-center justify-center mb-6 rounded-2xl overflow-hidden bg-navy-900/40 relative">
                      
                      {/* Rotating Gradient */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-spin-slower opacity-50">
                        <div className="w-full h-full bg-[conic-gradient(var(--tw-gradient-stops))] from-transparent via-gold-400/10 to-transparent blur-2xl"></div>
                      </div>
                      
                      {/* Static Light Highlight */}
                      <div className="absolute inset-0 bg-white/5"></div>

                    <img 
                      src={item.url_image || "https://via.placeholder.com/400x400?text=Image+Indispo"} 
                      alt={`${item.marque} ${item.modele}`}
                      className="max-h-full max-w-full object-contain drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500 relative z-10" 
                      referrerPolicy="no-referrer"
                      onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=Image+Indispo"}
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col relative z-20">
                    {/* Removed font-serif */}
                    <h3 className="text-gold-400 font-bold uppercase text-xs tracking-[0.15em] mb-1">{item.marque}</h3>
                    <h2 className="font-bold text-2xl text-white mb-4 leading-tight">{item.Modele || item.modele}</h2>
                    
                    <div className="mt-auto">
                      <a 
                        href={item['site web'] || item.url_produit || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => handleOfferClick(item)}
                        className="w-full py-3 bg-gradient-to-r from-gold-400 to-amber-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-gold-400/20 hover:shadow-gold-400/40 transition flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                      >
                        VOIR L'OFFRE <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-16 mb-12 max-w-md mx-auto px-6">
            <Button variant="outline" onClick={onRestart}>
              <div className="flex items-center gap-2 justify-center">
                <RefreshCw size={18} /> Recommencer
              </div>
            </Button>
            <button 
              onClick={onLogout} 
              className="w-full text-center text-gray-500 text-xs mt-6 hover:text-white transition tracking-widest uppercase"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;