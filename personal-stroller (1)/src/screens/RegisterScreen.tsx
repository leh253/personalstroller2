
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, Trash2, Check, Plus } from 'lucide-react';
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
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '', 
    gender: 'Femme',
    birthDate: '', 
    parentStatus: 'future', 
    pregnancyTerm: '', 
    children: [], 
    consent: false
  });

  const updateForm = (field: keyof UserFormData, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const addChild = () => { 
    if (formData.children.length < 6) {
      setFormData(p => ({...p, children: [...p.children, { name: '', age: '' }]})); 
    }
  };
  
  const removeChild = (index: number) => { 
    const c = [...formData.children]; 
    c.splice(index, 1); 
    setFormData(p => ({...p, children: c})); 
  };
  
  const updateChild = (index: number, field: 'name' | 'age', val: string) => { 
    const c = [...formData.children]; 
    c[index][field] = val; 
    setFormData(p => ({...p, children: c})); 
  };

  useEffect(() => { 
    if (formData.parentStatus === 'parent' && formData.children.length === 0) addChild(); 
  }, [formData.parentStatus]);

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.firstName) {
      return alert("Veuillez remplir au moins le prénom, l'email et le mot de passe.");
    }
    
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email, 
        password: formData.password, 
        options: { data: { first_name: formData.firstName, last_name: formData.lastName } }
      });
      
      if (authError) throw authError;

      if (authData.user) {
        const { error: dbError } = await supabase.from('user_leads').insert({
          id: authData.user.id, 
          email: formData.email, 
          first_name: formData.firstName, 
          last_name: formData.lastName,
          gender: formData.gender, 
          birth_date: formData.birthDate, 
          parent_status: formData.parentStatus,
          pregnancy_term: formData.parentStatus === 'future' ? formData.pregnancyTerm : null, 
          children: formData.parentStatus === 'parent' ? formData.children : [], 
          consent: formData.consent, 
          quiz_answers: {}
        });
        if (dbError) console.error("Error saving lead data:", dbError);
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      alert("Erreur Inscription: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const ageOptions = [
    { label: '0 (Nouveau-né)', value: '0' },
    { label: '1 an', value: '1' },
    { label: '2 ans', value: '2' },
    { label: '3 ans', value: '3' },
    { label: '4 ans', value: '4' },
    { label: '5 ans et +', value: '5+' },
  ];

  return (
    <div className="w-full flex flex-col bg-navy-900 min-h-screen">
      {/* Header fixe */}
      <div className="p-6 bg-navy-900/90 backdrop-blur-md z-10 flex items-center shrink-0 border-b border-white/5 sticky top-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white mr-4 transition-colors p-2 hover:bg-white/5 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-gold-400 font-medium text-lg tracking-widest uppercase">Mon Profil Expert</h2>
      </div>

      {/* Contenu - Défilement naturel par le body grâce à min-h-screen dans App.tsx */}
      <div className="p-6 pb-24 animate-in">
        <div className="max-w-md mx-auto space-y-12">
          
          <section>
            <p className="text-[10px] font-black text-gray-500 mb-6 tracking-widest uppercase">Informations Personnelles</p>
            <div className="flex bg-white/5 p-1 rounded-2xl mb-6 border border-white/5 backdrop-blur-sm">
              {(['Femme', 'Homme'] as Gender[]).map(g => (
                <button 
                  key={g} 
                  type="button"
                  onClick={() => updateForm('gender', g)} 
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${formData.gender === g ? 'bg-gold-400 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <InputField icon={User} placeholder="Prénom" value={formData.firstName} onChange={e => updateForm('firstName', e.target.value)} />
              <InputField icon={User} placeholder="Nom" value={formData.lastName} onChange={e => updateForm('lastName', e.target.value)} />
            </div>

            <DateSelectors label="Votre date de naissance" value={formData.birthDate} onChange={v => updateForm('birthDate', v)} type="past" />
            <InputField icon={Mail} type="email" placeholder="Email professionnel" value={formData.email} onChange={e => updateForm('email', e.target.value)} />
            <InputField icon={Lock} type="password" placeholder="Choisir un mot de passe" value={formData.password} onChange={e => updateForm('password', e.target.value)} />
          </section>

          <section className="animate-in-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-[10px] font-black text-gray-500 mb-6 tracking-widest uppercase">Situation Parentale</p>
            <div className="flex gap-4 mb-6">
              {[ { l: 'Enceinte', v: 'future' }, { l: 'Déjà parent', v: 'parent' } ].map(o => (
                <button 
                  key={o.v} 
                  type="button"
                  onClick={() => updateForm('parentStatus', o.v)} 
                  className={`flex-1 py-4 rounded-2xl text-xs font-bold border transition-all ${formData.parentStatus === o.v ? 'border-gold-400 bg-gold-400/20 text-gold-400 shadow-lg' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  {o.l}
                </button>
              ))}
            </div>

            {formData.parentStatus === 'future' && (
              <div className="animate-in">
                <DateSelectors label="Date prévue du terme" value={formData.pregnancyTerm} onChange={v => updateForm('pregnancyTerm', v)} type="future" />
              </div>
            )}

            {formData.parentStatus === 'parent' && (
              <div className="space-y-6 animate-in">
                {formData.children.map((c, i) => (
                  <div key={i} className="bg-navy-800/50 p-6 rounded-[2rem] border border-white/5 relative group">
                    <button 
                      type="button"
                      onClick={() => removeChild(i)} 
                      className="absolute top-4 right-4 text-white/20 hover:text-red-400 p-2 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                    <p className="text-gold-400 text-[10px] font-black mb-4 tracking-widest uppercase">Enfant {i+1}</p>
                    
                    <div className="flex gap-3">
                      <div className="flex-[2]">
                        <InputField icon={User} placeholder="Prénom" value={c.name} onChange={e => updateChild(i, 'name', e.target.value)} />
                      </div>
                      <div className="flex-1">
                        <select 
                          className="w-full glass-input py-4 px-3 rounded-2xl outline-none focus:border-gold-400/50 focus:bg-white/10 text-sm appearance-none transition-all shadow-inner bg-navy-900"
                          value={c.age}
                          onChange={e => updateChild(i, 'age', e.target.value)}
                        >
                          <option value="" disabled>Âge</option>
                          {ageOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-navy-900 text-white">{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.children.length < 6 && (
                  <button 
                    type="button"
                    onClick={addChild} 
                    className="w-full py-4 border border-dashed border-white/20 text-gray-400 rounded-2xl hover:text-gold-400 hover:border-gold-400 transition hover:bg-white/5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                  >
                    <Plus size={16} /> Ajouter un enfant
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="pt-6 animate-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex gap-4 mb-8 cursor-pointer group select-none items-start" onClick={() => updateForm('consent', !formData.consent)}>
              <div className={`w-6 h-6 rounded border flex items-center justify-center transition shrink-0 ${formData.consent ? 'bg-gold-400 border-gold-400 shadow-glow' : 'border-gray-500 bg-white/5 group-hover:border-gray-300'}`}>
                {formData.consent && <Check size={14} className="text-white" />}
              </div>
              <p className="text-[11px] text-gray-400 flex-1 leading-relaxed">
                J'accepte de recevoir des recommandations personnalisées basées sur ma situation familiale.
              </p>
            </div>

            <Button variant="primary" onClick={handleRegister} disabled={!formData.consent || loading}>
              {loading ? "Création du profil..." : "Valider mon inscription"}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
