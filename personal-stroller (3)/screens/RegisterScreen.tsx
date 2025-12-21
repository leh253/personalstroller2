import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Trash2, Check } from 'lucide-react';
import { supabase } from '../services/supabase';
import { UserFormData, Gender } from '../types';
import InputField from '../components/InputField';
import Button from '../components/Button';
import DateSelectors from '../components/DateSelectors';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const RegisterScreen: React.FC<Props> = ({ onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    email: '', password: '', firstName: '', lastName: '', gender: 'Femme',
    birthDate: '', parentStatus: 'future', pregnancyTerm: '', children: [], consent: false
  });

  const updateForm = (field: keyof UserFormData, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const addChild = () => {
    // Updated to use age instead of birthDate to match the updated Child interface
    if (formData.children.length < 6) setFormData(p => ({...p, children: [...p.children, { name: '', age: '' }]}));
  };

  const removeChild = (index: number) => {
    const c = [...formData.children];
    c.splice(index, 1);
    // Updated to use age instead of birthDate
    if (c.length === 0) c.push({ name: '', age: '' });
    setFormData(p => ({...p, children: c}));
  };

  const updateChild = (index: number, field: 'name' | 'age', val: string) => {
    const c = [...formData.children];
    c[index][field] = val;
    setFormData(p => ({...p, children: c}));
  };

  React.useEffect(() => {
    if (formData.parentStatus === 'parent' && formData.children.length === 0) addChild();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.parentStatus]);

  const handleRegister = async () => {
    if (!formData.email || !formData.password) return alert("Champs requis manquants");
    setLoading(true);
    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email, 
        password: formData.password,
        options: { 
          data: { 
            first_name: formData.firstName, 
            last_name: formData.lastName 
          } 
        }
      });

      if (authError) throw authError;

      // 2. Save detailed profile data to 'user_leads' table
      if (authData.user) {
        const { error: dbError } = await supabase.from('user_leads').insert({
          id: authData.user.id, // Important: Link to auth user
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          gender: formData.gender,
          birth_date: formData.birthDate,
          parent_status: formData.parentStatus,
          pregnancy_term: formData.pregnancyTerm,
          children: formData.children, // Stored as JSON
          consent: formData.consent,
          quiz_answers: {} // Initialize empty, will be filled later
        });

        if (dbError) {
          console.error("Error saving lead data:", dbError);
          // DIAGNOSTIC : Afficher l'erreur à l'utilisateur pour le débogage
          alert(`Erreur Base de Données (${dbError.code}): ${dbError.message}\n\nAstuce: Vérifiez que l'option "Confirm Email" est désactivée dans Supabase > Auth > Providers.`);
        }
      }

      onSuccess();
    } catch (error: any) {
      console.error(error);
      alert("Erreur Inscription: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-8 flex flex-col animate-in relative overflow-y-auto no-scrollbar">
      <div className="max-w-md w-full mx-auto flex flex-col justify-center min-h-full">
        <button 
          onClick={onBack} 
          className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors p-3 hover:bg-white/5 rounded-full backdrop-blur-sm border border-transparent hover:border-white/10"
        >
          <ArrowLeft />
        </button>
        
        <div className="mt-8 mb-10 text-center">
          <h2 className="text-4xl font-light text-white mb-2 tracking-tight">Créer un compte</h2>
          <p className="text-gray-400 font-light">Inscrivez-vous pour sauvegarder vos résultats</p>
        </div>
        
        <div className="glass-panel p-8 rounded-[2rem]">
          <p className="text-xs font-bold text-gray-400 mb-4 tracking-wider uppercase">Vos informations</p>
          
          <div className="flex bg-white/5 p-1 rounded-2xl mb-6 border border-white/5 backdrop-blur-sm">
            {(['Femme', 'Homme'] as Gender[]).map(g => (
              <button key={g} onClick={() => updateForm('gender', g)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${formData.gender === g ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-400 hover:text-white'}`}>{g}</button>
            ))}
          </div>

          <div className="flex gap-3">
            <InputField icon={User} placeholder="Prénom" value={formData.firstName} onChange={e => updateForm('firstName', e.target.value)} />
            <InputField icon={User} placeholder="Nom" value={formData.lastName} onChange={e => updateForm('lastName', e.target.value)} />
          </div>

          <DateSelectors label="Date de naissance" value={formData.birthDate} onChange={v => updateForm('birthDate', v)} type="past" />
          <InputField icon={Mail} type="email" placeholder="Email" value={formData.email} onChange={e => updateForm('email', e.target.value)} />
          <InputField icon={Lock} type="password" placeholder="Mot de passe" value={formData.password} onChange={e => updateForm('password', e.target.value)} />

          <p className="text-xs font-bold text-gray-400 mt-8 mb-4 tracking-wider uppercase">Votre situation</p>
          
          <div className="flex gap-4 mb-6">
            {[ { l: 'Enceinte', v: 'future' }, { l: 'Déjà parent', v: 'parent' } ].map(o => (
              <button key={o.v} onClick={() => updateForm('parentStatus', o.v)} className={`flex-1 py-4 rounded-2xl text-sm border backdrop-blur-sm transition-all ${formData.parentStatus === o.v ? 'border-gold-400 bg-gold-400/20 text-gold-400 shadow-[0_0_15px_rgba(197,160,101,0.1)]' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>{o.l}</button>
            ))}
          </div>

          {formData.parentStatus === 'future' && <div className="animate-in"><DateSelectors label="Date du terme" value={formData.pregnancyTerm} onChange={v => updateForm('pregnancyTerm', v)} type="future" /></div>}

          {formData.parentStatus === 'parent' && (
            <div className="space-y-4 animate-in mb-6">
              {formData.children.map((c, i) => (
                <div key={i} className="glass-panel p-4 rounded-2xl border border-white/10 relative">
                  <button onClick={() => removeChild(i)} className="absolute top-2 right-2 text-white/30 hover:text-red-400 p-2 transition-colors"><Trash2 size={16} /></button>
                  <p className="text-gold-400 text-xs font-bold mb-3 tracking-widest uppercase">Enfant {i+1}</p>
                  <InputField icon={User} placeholder="Prénom" value={c.name} onChange={e => updateChild(i, 'name', e.target.value)} />
                  {/* Updated from DateSelectors to a select dropdown for age to match Child interface */}
                  <div className="relative w-full mb-5">
                    <select 
                      className="w-full glass-input py-4 px-4 rounded-2xl outline-none focus:border-gold-400/50 focus:bg-white/10 text-sm appearance-none transition-all shadow-inner bg-navy-900 text-white"
                      value={c.age}
                      onChange={e => updateChild(i, 'age', e.target.value)}
                    >
                      <option value="" disabled>Âge</option>
                      {['0','1','2','3','4','5+'].map(age => <option key={age} value={age} className="bg-navy-900">{age} an{age !== '0' && age !== '1' ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {formData.children.length < 6 && <button onClick={addChild} className="w-full py-3 border border-dashed border-white/20 text-gray-400 rounded-xl hover:text-gold-400 hover:border-gold-400 transition hover:bg-white/5">+ Ajouter un enfant</button>}
            </div>
          )}

          <div className="flex gap-3 mt-8 mb-6 cursor-pointer group select-none items-start" onClick={() => updateForm('consent', !formData.consent)}>
            <div className={`w-6 h-6 rounded border flex items-center justify-center transition shrink-0 ${formData.consent ? 'bg-gold-400 border-gold-400 shadow-glow' : 'border-gray-500 bg-white/5 group-hover:border-gray-300'}`}>{formData.consent && <Check size={14} className="text-white" />}</div>
            <p className="text-xs text-gray-400 flex-1 leading-relaxed pt-0.5">J'accepte de recevoir des recommandations personnalisées basées sur mes réponses.</p>
          </div>

          <Button variant="primary" onClick={handleRegister} disabled={!formData.consent || loading} className="mt-2 shadow-xl">{loading ? "Chargement..." : "Valider & Continuer"}</Button>
          <div className="h-10"></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;