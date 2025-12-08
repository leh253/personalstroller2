import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import { QUIZ_STEPS } from '../constants';
import { QuizAnswers } from '../types';

interface Props {
  onComplete: (answers: QuizAnswers) => void;
  onBack: () => void;
  initialAnswers?: QuizAnswers;
}

const QuizScreen: React.FC<Props> = ({ onComplete, onBack, initialAnswers }) => {
  const [stepIndex, setStepIndex] = useState(() => initialAnswers && Object.keys(initialAnswers).length > 0 ? QUIZ_STEPS.length - 1 : 0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentQ = QUIZ_STEPS[stepIndex];
  const isLastQuestion = stepIndex === QUIZ_STEPS.length - 1;

  const handleAnswer = (value: string) => {
    if (isSubmitting) return; // Empêcher double-clic

    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    
    // Feedback visuel immédiat pour la dernière question
    if (isLastQuestion) {
      setIsSubmitting(true);
    }

    // Petit délai pour l'animation
    setTimeout(() => {
      if (!isLastQuestion) {
        setStepIndex(prev => prev + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 200); 
  };

  const handleBack = () => {
    if (isSubmitting) return;
    if (stepIndex > 0) setStepIndex(prev => prev - 1);
    else onBack();
  };

  const progress = ((stepIndex + 1) / QUIZ_STEPS.length) * 100;

  return (
    <div className="w-full h-full p-6 flex flex-col">
      <div className="max-w-md w-full mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-in">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack} 
              className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5 backdrop-blur-sm" 
              aria-label="Retour"
              disabled={isSubmitting}
            >
              <ArrowLeft size={20} />
            </button>
            <Logo size="small" />
          </div>
          <div className="text-right">
            {/* Removed font-serif */}
            <p className="text-gold-400 font-bold text-xl italic">0{stepIndex + 1} <span className="text-gray-500 text-sm font-normal not-italic">/ 0{QUIZ_STEPS.length}</span></p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-1 rounded-full mb-12 overflow-hidden backdrop-blur-sm border border-white/5 animate-in">
          <div className="h-full bg-gradient-to-r from-gold-400 via-yellow-300 to-amber-500 transition-all duration-700 ease-out shadow-[0_0_15px_#c5a065]" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Area - Animated Key based on Question ID */}
        <div key={currentQ.id} className="flex-1 flex flex-col justify-center animate-in-up">
          {/* Removed font-serif, kept simple sans */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 leading-tight px-2 text-white drop-shadow-md">
            {currentQ.question}
          </h2>
          <div className="space-y-4">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentQ.id] === opt.value;
              const showLoading = isSelected && isSubmitting && isLastQuestion;
              
              return (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(opt.value)} 
                  disabled={isSubmitting}
                  className={`w-full py-5 px-6 rounded-2xl transition-all duration-300 text-lg flex justify-between items-center group border backdrop-blur-md ${
                    isSelected 
                      ? 'bg-gradient-to-r from-gold-400 to-amber-600 border-gold-400 text-white shadow-[0_8px_25px_rgba(197,160,101,0.3)] scale-[1.02]' 
                      : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/30 hover:shadow-lg active:scale-[0.98]'
                  } ${isSubmitting && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={`font-medium tracking-wide text-left flex-1 mr-4 ${isSelected ? 'text-white' : 'text-gray-100'}`}>
                    {showLoading ? "Validation..." : opt.label}
                  </span>
                  <span className={`shrink-0 transition-transform duration-300 ${isSelected ? 'text-white' : 'text-gold-400/60 group-hover:translate-x-1 group-hover:text-gold-400'}`}>
                    {showLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      isSelected ? '✓' : <ArrowRight size={20} />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;