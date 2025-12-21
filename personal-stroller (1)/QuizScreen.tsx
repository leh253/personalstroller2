import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from './Logo';
import { QUIZ_STEPS } from './constants';
import { QuizAnswers } from './types';

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
    if (isSubmitting) return;
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    if (isLastQuestion) setIsSubmitting(true);
    setTimeout(() => {
      if (!isLastQuestion) setStepIndex(prev => prev + 1);
      else onComplete(newAnswers);
    }, 200); 
  };

  const handleBack = () => {
    if (isSubmitting) return;
    if (stepIndex > 0) setStepIndex(prev => prev - 1);
    else onBack();
  };

  const progress = ((stepIndex + 1) / QUIZ_STEPS.length) * 100;

  return (
    <div className="w-full h-full p-6 flex flex-col animate-in">
      <div className="max-w-md w-full mx-auto flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5" disabled={isSubmitting}>
              <ArrowLeft size={20} />
            </button>
            <Logo size="small" />
          </div>
          <div className="text-right">
            <p className="text-[#c5a065] font-bold text-xl italic">0{stepIndex + 1} <span className="text-gray-500 text-sm font-normal not-italic">/ 0{QUIZ_STEPS.length}</span></p>
          </div>
        </div>
        <div className="w-full bg-white/5 h-1 rounded-full mb-12 overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-[#c5a065] via-yellow-300 to-[#b08d55] transition-all duration-700 ease-out shadow-[0_0_10px_#c5a065]" style={{ width: `${progress}%` }}></div>
        </div>
        <div key={currentQ.id} className="flex-1 flex flex-col justify-center animate-in-up">
          <h2 className="text-3xl font-bold text-center mb-12 leading-tight px-2 text-white">{currentQ.question}</h2>
          <div className="space-y-4">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentQ.id] === opt.value;
              return (
                <button key={i} onClick={() => handleAnswer(opt.value)} disabled={isSubmitting} className={`w-full py-5 px-6 rounded-2xl transition-all duration-300 text-lg flex justify-between items-center group border backdrop-blur-md ${isSelected ? 'bg-gradient-to-r from-[#c5a065] to-[#b08d55] border-[#c5a065] text-white shadow-lg scale-[1.02]' : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/30'}`}>
                  <span className="font-medium tracking-wide text-left flex-1 mr-4">{opt.label}</span>
                  <span className="shrink-0">{isSelected ? '✓' : <ArrowRight size={20} className="text-[#c5a065]" />}</span>
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