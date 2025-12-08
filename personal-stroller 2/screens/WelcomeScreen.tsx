import React from 'react';
import Logo from '../components/Logo';
import Button from '../components/Button';

interface Props {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="w-full h-full p-8 flex flex-col items-center justify-center animate-in">
      <div className="max-w-md w-full flex flex-col items-center">
        <Logo />
        <p className="text-center mb-12 text-gray-300 font-light px-4 text-lg">
          Répondez à 6 questions simples et trouvez la poussette idéale.
        </p>
        <div className="w-full space-y-4">
          <Button variant="outline" onClick={onLoginClick}>Se connecter</Button>
          <Button variant="primary" onClick={onRegisterClick}>Commencer le Quiz</Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;