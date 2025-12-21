
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from './Logo.tsx';
import { QUIZ_STEPS } from './constants.ts';
import { QuizAnswers } from './types.ts';

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
  const isQuestion5 = currentQ.id === 'Q5';

  const handleAnswer = (value: string) => {
    if (isSubmitting) return;
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    if (isLastQuestion) setIsSubmitting(true);
    setTimeout(() => {
      if (!isLastQuestion) setStepIndex(prev => prev + 1);
      else onComplete(newAnswers);
    }, 200); 
  };

  const progress = ((stepIndex + 1) / QUIZ_STEPS.length) * 100;

  return (
    <div className="w-full flex-1 flex flex-col bg-navy-900 relative min-h-screen overflow-hidden">
      <div className="p-4 shrink-0">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => stepIndex > 0 ? setStepIndex(s => s - 1) : onBack()} 
                className="text-gray-400 hover:text-white p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors"
                disabled={isSubmitting}
              >
                <ArrowLeft size={20} />
              </button>
              <Logo size="small" />
            </div>
            <p className="text-[#c5a065] font-bold text-lg italic tabular-nums">
              0{stepIndex + 1} <span className="text-gray-500 text-xs font-normal">/ 0{QUIZ_STEPS.length}</span>
            </p>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-[#c5a065] to-[#b08d55] transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div key={currentQ.id} className="animate-in-up flex flex-col">
            <h2 className={`${isQuestion5 ? 'text-lg mb-6' : 'text-2xl mb-8'} font-bold text-center text-white leading-tight px-2`}>
              {currentQ.question}
            </h2>
            
            <div className={`space-y-3 ${isQuestion5 ? 'px-2' : ''}`}>
              {currentQ.options.map((opt, i) => {
                const isSelected = answers[currentQ.id] === opt.value;
                const showLoading = isSelected && isSubmitting && isLastQuestion;
                
                return (
                  <button 
                    key={i} 
                    onClick={() => handleAnswer(opt.value)} 
                    disabled={isSubmitting} 
                    className={`w-full transition-all duration-300 flex justify-between items-center border ${
                      isQuestion5 ? 'py-3 px-4 rounded-xl' : 'py-4 px-5 rounded-2xl'
                    } ${
                      isSelected 
                        ? 'bg-[#c5a065] border-[#c5a065] text-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    <span className={`font-semibold text-left flex-1 mr-3 ${isQuestion5 ? 'text-[11px] leading-tight' : 'text-[15px]'}`}>
                      {showLoading ? "Validation..." : opt.label}
                    </span>
                    <ArrowRight size={isQuestion5 ? 14 : 18} className={isSelected ? 'text-white' : 'text-[#c5a065]'} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
