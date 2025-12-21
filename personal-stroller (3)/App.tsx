
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen.tsx';
import LoginScreen from './LoginScreen.tsx';
import RegisterScreen from './RegisterScreen.tsx';
import QuizScreen from './QuizScreen.tsx';
import ResultsScreen from './ResultsScreen.tsx';
import PrivacyPolicy from './PrivacyPolicy.tsx';
import Logo from './Logo.tsx';
import { supabase } from './supabase.ts';
import { fetchMatchingStrollers } from './strollerService.ts';
import { ScreenState, QuizAnswers, Stroller } from './types.ts';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState | 'privacy'>('welcome');
  const [results, setResults] = useState<Stroller[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | undefined>(undefined);
  const [initializing, setInitializing] = useState(true);
  const [quizSessionId, setQuizSessionId] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setScreen('quiz');
        }
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        setInitializing(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setScreen(current => {
           if (current !== 'welcome' && current !== 'login' && current !== 'register') return 'welcome';
           return current;
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setScreen('loading_results');
    try {
      const matches = await fetchMatchingStrollers(answers);
      setResults(matches);
      saveToDatabaseInBackground(answers, matches.length);
      setScreen('results');
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
      setScreen('quiz');
    }
  };

  const saveToDatabaseInBackground = async (answers: QuizAnswers, resultCount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await Promise.all([
          supabase.from('user_leads').upsert({ 
            id: user.id, email: user.email, quiz_answers: answers, updated_at: new Date().toISOString()
          }, { onConflict: 'id' }),
          supabase.from('quiz_history').insert({
            user_id: user.id, answers: answers, result_count: resultCount
          })
        ]);
      }
    } catch (err) {
      console.warn("Background save failed:", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen('welcome');
    setResults([]);
    setQuizAnswers(undefined);
    setQuizSessionId(id => id + 1);
  };

  if (initializing) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-navy-900 text-white">
        <Logo />
        <div className="w-8 h-8 border-2 border-white/10 border-t-gold-400 rounded-full animate-spin mt-6"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-navy-900 overflow-x-hidden overflow-y-auto">
      {screen === 'welcome' && (
        <div className="flex-1 flex flex-col">
          <WelcomeScreen onLoginClick={() => setScreen('login')} onRegisterClick={() => setScreen('register')} />
          <button 
            onClick={() => setScreen('privacy')} 
            className="text-[10px] text-gray-500 hover:text-gray-300 transition text-center pb-8 uppercase tracking-widest mt-auto"
          >
            Politique de Confidentialité
          </button>
        </div>
      )}
      {screen === 'privacy' && <PrivacyPolicy onBack={() => setScreen('welcome')} />}
      {screen === 'login' && <LoginScreen onBack={() => setScreen('welcome')} onSuccess={() => { setQuizAnswers(undefined); setQuizSessionId(id => id + 1); setScreen('quiz'); }} />}
      {screen === 'register' && <RegisterScreen onBack={() => setScreen('welcome')} onSuccess={() => { setQuizAnswers(undefined); setQuizSessionId(id => id + 1); setScreen('quiz'); }} />}
      {screen === 'quiz' && (
        <QuizScreen 
          key={quizSessionId} 
          initialAnswers={quizAnswers} 
          onComplete={handleQuizComplete} 
          onBack={() => setScreen('welcome')} 
        />
      )}
      {screen === 'loading_results' && (
        <div className="flex-1 flex flex-col items-center justify-center text-white">
          <Logo />
          <div className="w-12 h-12 border-4 border-white/10 border-t-gold-400 rounded-full animate-spin mt-10"></div>
          <p className="text-gray-300 mt-6 text-sm tracking-widest font-light">ANALYSE EN COURS...</p>
        </div>
      )}
      {screen === 'results' && (
        <ResultsScreen 
          results={results} 
          onRestart={() => { setQuizAnswers(undefined); setQuizSessionId(s => s + 1); setScreen('quiz'); }} 
          onBack={() => setScreen('quiz')} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;
