
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';
import Logo from './components/Logo';
import { supabase } from './services/supabase';
import { fetchMatchingStrollers } from './services/strollerService';
import { ScreenState, QuizAnswers, Stroller } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('welcome');
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
           if (current !== 'welcome' && current !== 'login' && current !== 'register') return 'welcome';
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
      saveToDatabaseInBackground(answers, matches.length);
      setScreen('results');
    } catch (error: any) {
      console.error("Erreur critique recherche:", error);
      alert(`Erreur de recherche: ${error.message || error}`);
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

  const handleRestartQuiz = () => {
    setQuizAnswers(undefined);
    setScreen('quiz');
  };

  const handleBackToQuiz = () => {
    setScreen('quiz');
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
    <div className="min-h-screen w-full flex flex-col bg-navy-900 selection:bg-gold-400/30">
      {screen === 'welcome' && <WelcomeScreen onLoginClick={() => setScreen('login')} onRegisterClick={() => setScreen('register')} />}
      {screen === 'login' && <LoginScreen onBack={() => setScreen('welcome')} onSuccess={() => { setQuizAnswers(undefined); setScreen('quiz'); }} />}
      {screen === 'register' && <RegisterScreen onBack={() => setScreen('welcome')} onSuccess={() => { setQuizAnswers(undefined); setScreen('quiz'); }} />}
      {screen === 'quiz' && <QuizScreen initialAnswers={quizAnswers} onComplete={handleQuizComplete} onBack={() => setScreen('welcome')} />}
      {screen === 'loading_results' && (
        <div className="animate-in flex flex-col items-center justify-center min-h-screen text-white">
          <Logo />
          <div className="w-12 h-12 border-4 border-white/10 border-t-gold-400 rounded-full animate-spin mt-10 shadow-[0_0_15px_rgba(197,160,101,0.3)]"></div>
          <p className="text-gray-300 mt-6 text-sm animate-pulse tracking-widest font-light">RECHERCHE EN COURS...</p>
        </div>
      )}
      {screen === 'results' && <ResultsScreen results={results} onRestart={handleRestartQuiz} onBack={handleBackToQuiz} onLogout={handleLogout} />}
    </div>
  );
};

export default App;
