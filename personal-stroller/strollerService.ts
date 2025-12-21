
import { supabase } from './supabase.ts';
import { QuizAnswers, Stroller } from './types.ts';

const cleanText = (text: any): string => {
  if (!text) return "";
  let s = String(text);
  s = s.replace(/\uFFFD/g, "é").replace(/Ã©/g, "é").replace(/Ã¨/g, "è").replace(/Ã /g, "à").replace(/Ã¢/g, "â");
  if (s.toLowerCase().includes("pav") && s.length <= 7) return "pavé";
  return s.trim();
};

const transformImageUrl = (url: any): string => {
  if (!url) return "";
  const s = String(url).trim();
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = s.match(driveRegex);
  return match ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000` : s;
};

export const fetchMatchingStrollers = async (answers: QuizAnswers): Promise<Stroller[]> => {
  try {
    const { data: raw, error } = await supabase.from('poussettes').select('*');
    if (error) throw error;
    
    const norm = (txt: string) => String(txt || "").toLowerCase().trim();

    return (raw || []).map((s: any) => ({
      ...s,
      marque: cleanText(s.marque),
      modele: cleanText(s.Modele || s.modele),
      Q1: cleanText(s.Q1 || s.q1), Q2: cleanText(s.Q2 || s.q2), Q3: cleanText(s.Q3 || s.q3),
      Q4: cleanText(s.Q4 || s.q4), Q5: cleanText(s.Q5 || s.q5), Q6: cleanText(s.Q6 || s.q6),
      url_image: transformImageUrl(s.url_image)
    }) as Stroller).filter(s => {
      if (norm(s.Q1) !== norm(answers.Q1)) return false;
      if (norm(s.Q2) !== norm(answers.Q2)) return false;
      if (norm(s.Q3) !== norm(answers.Q3)) return false;
      if (norm(s.Q4) !== norm(answers.Q4)) return false;
      
      const sQ5 = norm(s.Q5);
      const aQ5 = norm(answers.Q5);
      if (aQ5 === 'voyage') { if (sQ5 !== 'voyage') return false; }
      else if (aQ5 === 'city') { if (sQ5 !== 'city') return false; }
      else if (aQ5 === 'pavé') { if (sQ5 !== 'pavé') return false; }
      else { if (sQ5 !== aQ5) return false; }

      return norm(s.Q6) === norm(answers.Q6);
    });
  } catch (error) {
    throw error;
  }
};

export const recordProductClick = async (stroller: Stroller) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('product_clicks').insert({
        user_id: user.id,
        marque: stroller.marque,
        modele: stroller.modele,
        target_url: stroller['site web'] || stroller.url_produit,
      });
    }
  } catch (e) {}
};

export const deleteUserAccountData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await Promise.all([
    supabase.from('user_leads').delete().eq('id', user.id),
    supabase.from('quiz_history').delete().eq('user_id', user.id)
  ]);
};
