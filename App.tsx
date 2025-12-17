import React, { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import QuizScreen from './QuizScreen';
import ResultsScreen from './ResultsScreen';
import Logo from './Logo';
import { supabase } from './supabase';
import { fetchMatchingStrollers } from './strollerService';
import { ScreenState, QuizAnswers, Stroller } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('welcome');
  const [results, setResults] = useState<Stroller[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | undefined>(undefined);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Fail-safe : on ne reste jamais bloqué plus de 3s sur l'écran de chargement
    const timer = setTimeout(() => {
      if (initializing) setInitializing(false);
    }, 3000);

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setScreen('quiz');
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setInitializing(false);
        clearTimeout(timer);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        setScreen('quiz');
      } else if (event === 'SIGNED_OUT') {
        setScreen('welcome');
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setScreen('loading_results');
    try {
      const matches = await fetchMatchingStrollers(answers);
      setResults(matches);
      setScreen('results');
    } catch (error) {
      alert("Erreur lors de la recherche.");
      setScreen('quiz');
    }
  };

  if (initializing) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#151b2b] z-50">
        <Logo className="animate-pulse" />
        <div className="mt-8 w-12 h-1 text-[#c5a065] relative overflow-hidden bg-white/5 rounded-full">
          <div className="absolute inset-0 bg-[#c5a065] animate-[loading_1.5s_infinite]"></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#151b2b]">
      {screen === 'welcome' && <WelcomeScreen onLoginClick={() => setScreen('login')} onRegisterClick={() => setScreen('register')} />}
      {screen === 'login' && <LoginScreen onBack={() => setScreen('welcome')} onSuccess={() => setScreen('quiz')} />}
      {screen === 'register' && <RegisterScreen onBack={() => setScreen('welcome')} onSuccess={() => setScreen('quiz')} />}
      {screen === 'quiz' && <QuizScreen initialAnswers={quizAnswers} onComplete={handleQuizComplete} onBack={() => setScreen('welcome')} />}
      
      {screen === 'loading_results' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Logo />
          <div className="mt-12 w-10 h-10 border-2 border-white/10 border-t-[#c5a065] rounded-full animate-spin"></div>
          <p className="text-[#c5a065] mt-8 text-[10px] font-black tracking-widest uppercase">Analyse Expert...</p>
        </div>
      )}
      
      {screen === 'results' && (
        <ResultsScreen 
          results={results} 
          onRestart={() => setScreen('quiz')} 
          onBack={() => setScreen('quiz')} 
          onLogout={async () => { await supabase.auth.signOut(); setScreen('welcome'); }} 
        />
      )}
    </div>
  );
};

export default App;