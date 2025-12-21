import React, { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import QuizScreen from './QuizScreen';
import ResultsScreen from './ResultsScreen';
import PrivacyPolicy from './PrivacyPolicy';
import Logo from './Logo';
import { supabase } from './supabase';
import { fetchMatchingStrollers } from './strollerService';
import { ScreenState, QuizAnswers, Stroller } from './types';

type AppScreenState = ScreenState | 'privacy';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreenState>('welcome');
  const [results, setResults] = useState<Stroller[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | undefined>(undefined);
  const [initializing, setInitializing] = useState(true);

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
           if (current !== 'welcome' && current !== 'login' && current !== 'register' && current !== 'privacy') return 'welcome';
           return current;
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen('welcome');
    setResults([]);
    setQuizAnswers(undefined);
  };

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setScreen('loading_results');
    try {
      const matches = await fetchMatchingStrollers(answers);
      setResults(matches);
      setScreen('results');
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
      setScreen('quiz');
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 text-white">
        <Logo />
        <div className="w-8 h-8 border-2 border-white/10 border-t-gold-400 rounded-full animate-spin mt-6"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-navy-900">
      {screen === 'welcome' && (
        <div className="flex-1 flex flex-col">
          <WelcomeScreen onLoginClick={() => setScreen('login')} onRegisterClick={() => setScreen('register')} />
          <button onClick={() => setScreen('privacy')} className="text-[10px] text-gray-500 hover:text-gray-300 transition text-center pb-8 uppercase tracking-widest">
            Politique de Confidentialité
          </button>
        </div>
      )}
      {screen === 'privacy' && <PrivacyPolicy onBack={() => setScreen('welcome')} />}
      {screen === 'login' && <LoginScreen onBack={() => setScreen('welcome')} onSuccess={() => setScreen('quiz')} />}
      {screen === 'register' && <RegisterScreen onBack={() => setScreen('welcome')} onSuccess={() => setScreen('quiz')} />}
      {screen === 'quiz' && <QuizScreen initialAnswers={quizAnswers} onComplete={handleQuizComplete} onBack={() => setScreen('welcome')} />}
      {screen === 'loading_results' && (
        <div className="flex-1 flex flex-col items-center justify-center text-white">
          <Logo />
          <div className="w-12 h-12 border-4 border-white/10 border-t-gold-400 rounded-full animate-spin mt-10"></div>
          <p className="text-gray-300 mt-6 text-sm tracking-widest font-light">ANALYSE EXPERTE...</p>
        </div>
      )}
      {screen === 'results' && (
        <ResultsScreen 
          results={results} 
          onRestart={() => setScreen('quiz')} 
          onBack={() => setScreen('quiz')} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;