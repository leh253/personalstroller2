import React, { useState } from 'react';
import { RefreshCw, ExternalLink, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { recordProductClick, deleteUserAccountData } from '../services/strollerService';
import { Stroller } from '../types';

interface Props {
  results: Stroller[];
  onRestart: () => void;
  onBack: () => void;
  onLogout: () => void;
}

const ResultsScreen: React.FC<Props> = ({ results, onRestart, onBack, onLogout }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOfferClick = (stroller: Stroller) => { recordProductClick(stroller); };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUserAccountData();
      alert("Vos données ont été supprimées avec succès.");
      onLogout();
    } catch (error: any) {
      console.error(error);
      alert("Erreur lors de la suppression : " + error.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-in bg-navy-900 select-none">
      {/* Header Simple */}
      <div className="p-6 bg-navy-900 z-10 flex flex-col items-center shrink-0 relative border-b border-white/5 shadow-md">
        <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><ArrowLeft size={24} /></button>
        <Logo size="small" className="scale-100 mb-2" />
        <div className="text-center">
          <h2 className="text-lg text-white tracking-widest font-light mt-1 uppercase">Votre Sélection</h2>
          <p className="text-xs text-gray-400">{results.length} résultat(s)</p>
        </div>
      </div>

      {/* Liste des résultats */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="max-w-4xl mx-auto pb-24">
          
          {results.length === 0 && (
            <div className="text-center mt-20 opacity-70">
              <p className="text-xl mb-2 text-white font-medium">Aucun résultat exact.</p>
              <p className="text-sm text-gray-400">Essayez de modifier vos critères.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item, i) => (
              <div key={i} className="bg-navy-800/50 border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:border-gold-400/30 transition-all">
                {/* Image Container - Simple et Propre */}
                <div className="bg-white p-6 h-48 flex items-center justify-center relative">
                   <img 
                    src={item.url_image || "https://via.placeholder.com/400x400?text=Image+Indispo"} 
                    alt={`${item.marque} ${item.modele}`} 
                    className="max-h-full max-w-full object-contain" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=No+Image"} 
                   />
                </div>
                
                {/* Contenu */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-gold-400 font-bold text-xs tracking-widest uppercase mb-1">{item.marque}</h3>
                    <h2 className="text-lg font-semibold text-white leading-snug">{item.Modele || item.modele}</h2>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <a 
                      href={item['site web'] || item.url_produit || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => handleOfferClick(item)} 
                      className="block w-full py-3 bg-gold-500 hover:bg-gold-600 text-white text-center font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      VOIR L'OFFRE <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-12 mb-8 max-w-xs mx-auto space-y-6">
            <Button variant="outline" onClick={onRestart}>
              <div className="flex items-center gap-2 justify-center"><RefreshCw size={16} /> Recommencer</div>
            </Button>
            
            <div className="pt-6 border-t border-white/5">
              <button onClick={onLogout} className="w-full text-center text-gray-500 text-xs hover:text-white transition tracking-widest uppercase mb-4">Se déconnecter</button>
              
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className="w-full text-center text-red-900/50 text-[10px] hover:text-red-400 transition flex items-center justify-center gap-1"
                >
                  <Trash2 size={10} /> Supprimer mon compte
                </button>
              ) : (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center animate-in">
                  <div className="flex justify-center mb-2 text-red-400"><AlertTriangle size={20} /></div>
                  <p className="text-white text-xs mb-3 font-medium">Attention, action irréversible.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-white/5 rounded-lg text-xs text-gray-300">Annuler</button>
                    <button onClick={handleDeleteAccount} disabled={isDeleting} className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs text-white font-bold">{isDeleting ? '...' : 'Confirmer'}</button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;