
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
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setScreen('quiz');
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setInitializing(false);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        setScreen('quiz');
      } else if (event === 'SIGNED_OUT') {
        setScreen('welcome');
        setResults([]);
        setQuizAnswers(undefined);
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
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        supabase.from('user_leads').upsert({ 
          id: user.id, 
          email: user.email, 
          quiz_answers: answers, 
          updated_at: new Date().toISOString()
        }).then();
      }
      setScreen('results');
    } catch (error: any) {
      alert("Erreur de recherche. Veuillez réessayer.");
      setScreen('quiz');
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#151b2b]">
        <Logo className="animate-pulse" />
        <div className="w-12 h-0.5 bg-white/10 rounded-full mt-12 overflow-hidden">
          <div className="h-full bg-[#c5a065] animate-[loading_1.5s_infinite]"></div>
        </div>
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
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in">
          <Logo />
          <div className="mt-12 w-12 h-12 border-2 border-white/10 border-t-[#c5a065] rounded-full animate-spin"></div>
          <p className="text-[#c5a065] mt-8 text-[10px] font-black tracking-[0.3em] uppercase animate-pulse">Analyse Expert...</p>
        </div>
      )}
      
      {screen === 'results' && (
        <ResultsScreen 
          results={results} 
          onRestart={() => setScreen('quiz')} 
          onBack={() => setScreen('quiz')} 
          onLogout={async () => { await supabase.auth.signOut(); }} 
        />
      )}
    </div>
  );
};

export default App;
