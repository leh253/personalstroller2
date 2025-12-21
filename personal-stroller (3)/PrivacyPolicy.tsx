
import React from 'react';
import Logo from './Logo.tsx';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-navy-900 text-slate-300 p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gold-400 hover:underline">
          <ArrowLeft size={18} /> Retour
        </button>
        <Logo size="small" className="mb-8" />
        <h1 className="text-3xl font-bold text-white mb-6">Politique de Confidentialité</h1>
        <p className="mb-4">Dernière mise à jour : {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gold-400 mb-2">1. Collecte des données</h2>
            <p>Nous collectons les informations que vous nous fournissez lors de l'inscription : nom, prénom, adresse email et informations relatives à votre situation familiale (nombre d'enfants, âge) pour vous fournir des recommandations personnalisées.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gold-400 mb-2">2. Utilisation des données</h2>
            <p>Vos données sont utilisées exclusivement pour filtrer notre base de données de poussettes et vous proposer les produits les plus adaptés à votre profil. Nous ne vendons jamais vos données à des tiers.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gold-400 mb-2">3. Suppression des données</h2>
            <p>Vous pouvez à tout moment supprimer l'intégralité de vos données personnelles directement depuis l'application via le bouton "Supprimer mon compte" dans l'écran des résultats.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gold-400 mb-2">4. Hébergement</h2>
            <p>Les données sont hébergées de manière sécurisée sur Supabase (certifié conforme au RGPD).</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
