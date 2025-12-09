import { supabase } from './supabase';
import { QuizAnswers, Stroller } from '../types';

const cleanText = (text: any): string => {
  if (!text) return "";
  let s = String(text);
  s = s.replace(/\uFFFD/g, "é").replace(/Ã©/g, "é").replace(/Ã¨/g, "è").replace(/Ã /g, "à").replace(/Ã¢/g, "â").replace(/Ãª/g, "ê").replace(/Ã«/g, "ë").replace(/Ã®/g, "ï").replace(/Ã¯/g, "ï").replace(/Ã´/g, "ô").replace(/Ã¹/g, "ù").replace(/Ã»/g, "û").replace(/Ã¼/g, "ü").replace(/Ã§/g, "ç");
  if (s.toLowerCase().includes("pav") && s.length <= 7) return "pavé";
  return s.trim();
};

const transformImageUrl = (url: any): string => {
  if (!url) return "";
  const s = String(url).trim();
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = s.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  return s;
};

export const fetchMatchingStrollers = async (answers: QuizAnswers): Promise<Stroller[]> => {
  const { data: rawStrollers, error } = await supabase.from('poussettes').select('*');
  if (error) throw new Error(error.message);
  if (!rawStrollers) return [];

  const norm = (txt: string) => String(txt || "").toLowerCase().trim();

  return rawStrollers.map((s: any) => ({
    ...s,
    marque: cleanText(s.marque),
    modele: cleanText(s.Modele || s.modele),
    Q1: cleanText(s.Q1 || s.q1), Q2: cleanText(s.Q2 || s.q2), Q3: cleanText(s.Q3 || s.q3),
    Q4: cleanText(s.Q4 || s.q4), Q5: cleanText(s.Q5 || s.q5), Q6: cleanText(s.Q6 || s.q6),
    url_image: transformImageUrl(s.url_image)
  }) as Stroller).filter((stroller) => {
    if (norm(stroller.Q1) !== norm(answers.Q1)) return false;
    if (norm(stroller.Q2) !== norm(answers.Q2)) return false;
    if (norm(stroller.Q3) !== norm(answers.Q3)) return false;
    if (norm(stroller.Q4) !== norm(answers.Q4)) return false;
    if (answers.Q5 === 'voyage') { if (norm(stroller.Q5) !== 'voyage') return false; }
    else if (answers.Q5 === 'City') { if (norm(stroller.Q5) !== 'city') return false; }
    else { if (norm(stroller.Q5) !== norm(answers.Q5)) return false; }
    if (norm(stroller.Q6) !== norm(answers.Q6)) return false;
    return true;
  });
};

export const recordProductClick = async (stroller: Stroller) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('product_clicks').insert({
        user_id: user.id, marque: stroller.marque, modele: stroller.modele, target_url: stroller['site web'] || stroller.url_produit,
      });
    }
  } catch (error) { console.warn("Could not track click", error); }
};

export const deleteUserAccountData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Utilisateur non connecté");

  // Supprimer les données des tables (nécessite les policies DELETE dans Supabase)
  const p1 = supabase.from('user_leads').delete().eq('id', user.id);
  const p2 = supabase.from('quiz_history').delete().eq('user_id', user.id);
  
  await Promise.all([p1, p2]);
  
  // Note: La suppression du compte Auth (login) ne peut se faire que via l'admin ou une Edge Function
  // Pour l'app client, on supprime les données et on déconnecte, ce qui suffit souvent pour la conformité "In-App" basique.
  return true;
};