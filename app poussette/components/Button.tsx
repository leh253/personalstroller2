import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'option';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = '',
  type = 'button'
}) => {
  const baseStyle = "w-full py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    // Liquid Gold Gradient
    primary: "bg-gradient-to-r from-gold-400 to-amber-600 text-white shadow-[0_8px_20px_rgba(197,160,101,0.3)] hover:shadow-[0_12px_24px_rgba(197,160,101,0.4)] border border-white/20 backdrop-blur-sm",
    // Glassy Outline
    outline: "bg-white/5 border border-white/20 text-gold-400 hover:bg-white/10 hover:border-gold-400/50 backdrop-blur-sm",
    // Option Button (used in other contexts if needed)
    option: "bg-white text-gray-900 hover:bg-gray-100 justify-between px-6"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;