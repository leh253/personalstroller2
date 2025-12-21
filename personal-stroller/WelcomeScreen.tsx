
import React from 'react';
import Logo from './Logo.tsx';
import Button from './Button.tsx';

interface Props {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onLoginClick, onRegisterClick }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in">
    <Logo />
    <p className="text-center mt-4 mb-12 text-slate-300 font-light text-lg max-w-xs">
      Répondez à 6 questions simples et trouvez la poussette idéale.
    </p>
    <div className="w-full max-w-sm space-y-4">
      <Button variant="outline" onClick={onLoginClick}>Se connecter</Button>
      <Button variant="primary" onClick={onRegisterClick}>Commencer le Quiz</Button>
    </div>
  </div>
);

export default WelcomeScreen;
