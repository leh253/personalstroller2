import { QuizStep } from './types';

export const SUPABASE_URL = 'https://osijrppbtsllhnxjhjie.supabase.co';
export const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zaWpycHBidHNsbGhueGpoamllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTc1MzEsImV4cCI6MjA3OTY3MzUzMX0._XskIJ9_vBi5hMpT2k8ZJ_wCXfKsK1kFPYjXiDp8K9I';

export const QUIZ_STEPS: QuizStep[] = [
  { 
    id: "Q1", 
    question: "Pour combien d'enfants est la poussette ?", 
    options: [
      { label: "Un seul enfant", value: "un enfant" }, 
      { label: "Deux enfants (ou plus)", value: "deux ou plus" }
    ] 
  },
  { 
    id: "Q2", 
    question: "Quel type de pack recherchez-vous ?", 
    options: [
      { label: "Poussette seule", value: "seule" }, 
      { label: "Pack duo (poussette + nacelle)", value: "duo" }, 
      { label: "Pack Trio (poussette + nacelle + siège auto)", value: "trio" }
    ] 
  },
  { 
    id: "Q3", 
    question: "Avez-vous besoin d'une assise adaptée dès la naissance ?", 
    options: [
      { label: "Oui (position à plat)", value: "Naissance (0 mois)" }, 
      { label: "Non, l'enfant a déjà 6 mois ou plus", value: "six mois" }
    ] 
  },
  { 
    id: "Q4", 
    question: "Souhaitez-vous une assise réversible (face parent / face route) ?", 
    options: [
      { label: "Oui, c'est important pour moi", value: "OUI" }, 
      { label: "Non, ce n'est pas un critère essentiel", value: "NON" }
    ] 
  },
  { 
    id: "Q5", 
    question: "Sur quel type de terrain roulerez-vous principalement ?", 
    options: [
      { label: "En ville (trottoirs lisses, magasins)", value: "City" }, 
      { label: "Sur des pavés ou des routes de villes", value: "pavé" }, 
      { label: "Tout-terrain (chemins, parcs, campagne)", value: "tout terrain" },
      { label: "Pour les voyages (facile à plier et transporter)", value: "voyage" }
    ] 
  },
  { 
    id: "Q6", 
    question: "Quel est votre budget ?", 
    options: [
      { label: "Économique", value: "petit" }, 
      { label: "Standard", value: "Bon compromis" }, 
      { label: "Premium", value: "Illimité" }
    ] 
  }
];

export const MONTHS = ["Janv.", "Févr.", "Mars", "Avril", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];