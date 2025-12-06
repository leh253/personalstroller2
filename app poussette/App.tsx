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

  // 1. Check for existing session on startup
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // If user is already logged in, go straight to quiz
          // Only redirect if we are on the welcome screen (initial load)
          setScreen(prev => prev === 'welcome' ? 'quiz' : prev);
        }
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        setInitializing(false);
      }
    };

    checkUser();

    // Optional: Listen to auth changes (login/logout elsewhere in tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        // If session is lost (remote logout), go back to welcome
        // Use functional update to access current state safely
        setScreen(current => {
           if (current !== 'welcome' && current !== 'login' && current !== 'register') {
             return 'welcome';
           }
           return current;
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []); // CRITICAL FIX: Empty dependency array ensures this runs only ONCE

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setScreen('welcome');
    setResults([]);
    setQuizAnswers(undefined);
  };

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    
    // 1. Affichage immédiat de l'écran de chargement
    setScreen('loading_results');

    try {
      // 2. Calcul des résultats (CRITIQUE : Si ça échoue, on arrête tout)
      const matches = await fetchMatchingStrollers(answers);
      setResults(matches);

      // 3. Sauvegarde en arrière-plan (NON-CRITIQUE : Si ça échoue, on affiche quand même les résultats)
      // On n'attend pas (await) la fin de cette opération pour changer d'écran
      saveToDatabaseInBackground(answers, matches.length);

      // 4. Affichage des résultats immédiat
      setScreen('results');

    } catch (error: any) {
      console.error("Erreur critique recherche:", error);
      alert(`Erreur de recherche: ${error.message || error}`);
      setScreen('quiz');
    }
  };

  // Fonction séparée pour gérer la sauvegarde sans bloquer l'UI
  const saveToDatabaseInBackground = async (answers: QuizAnswers, resultCount: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Exécuter les deux sauvegardes en parallèle
        await Promise.all([
          // A. Update Profile
          supabase.from('user_leads').upsert({ 
            id: user.id,
            email: user.email,
            quiz_answers: answers,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' }),

          // B. Add to History
          supabase.from('quiz_history').insert({
            user_id: user.id,
            answers: answers,
            result_count: resultCount
          })
        ]);
      }
    } catch (err) {
      // On log juste l'erreur console, on n'embête pas l'utilisateur
      console.warn("Background save failed (non-fatal):", err);
    }
  };

  const handleRestartQuiz = () => {
    setQuizAnswers(undefined);
    setScreen('quiz');
  };

  const handleBackToQuiz = () => {
    setScreen('quiz');
  };

  const renderScreen = () => {
    if (initializing) {
      // Show a minimal loader while checking session
      return (
        <div className="flex flex-col items-center justify-center h-full animate-in">
          <Logo />
          <div className="w-8 h-8 border-2 border-white/10 border-t-gold-400 rounded-full animate-spin mt-6"></div>
        </div>
      );
    }

    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onLoginClick={() => setScreen('login')} 
            onRegisterClick={() => setScreen('register')} 
          />
        );
      case 'login':
        return (
          <LoginScreen 
            onBack={() => setScreen('welcome')} 
            onSuccess={() => {
              setQuizAnswers(undefined);
              setScreen('quiz');
            }} 
          />
        );
      case 'register':
        return (
          <RegisterScreen 
            onBack={() => setScreen('welcome')} 
            onSuccess={() => {
              setQuizAnswers(undefined);
              setScreen('quiz');
            }} 
          />
        );
      case 'quiz':
        return (
          <QuizScreen 
            initialAnswers={quizAnswers}
            onComplete={handleQuizComplete}
            onBack={() => setScreen('welcome')}
          />
        );
      case 'loading_results':
        return (
          <div className="animate-in flex flex-col items-center justify-center min-h-[600px] h-full text-white">
            <Logo />
            <div className="w-12 h-12 border-4 border-white/10 border-t-gold-400 rounded-full animate-spin mt-10 shadow-[0_0_15px_rgba(197,160,101,0.3)]"></div>
            <p className="text-gray-300 mt-6 text-sm animate-pulse tracking-widest font-light">RECHERCHE EN COURS...</p>
          </div>
        );
      case 'results':
        return (
          <ResultsScreen 
            results={results} 
            onRestart={handleRestartQuiz} 
            onBack={handleBackToQuiz}
            onLogout={handleLogout} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden bg-navy-900/30 backdrop-blur-sm">
      {/* Main App Container - Full Width/Height */}
      <div className="w-full h-full flex-1 flex flex-col">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;