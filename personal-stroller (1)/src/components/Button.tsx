
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'option';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', disabled = false, className = '', type = 'button' }) => {
  // Base style update: slightly reduced border radius for a more modern feel, clearer font weight
  const baseStyle = "w-full py-4 rounded-xl font-semibold text-[15px] tracking-wide transition-all duration-200 active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    // Solid Gold Gradient - Cleaner
    primary: "bg-gradient-to-r from-[#c5a065] to-[#b08d55] text-white shadow-lg shadow-[#c5a065]/20 border-t border-white/20",
    
    // Outline - Cleaner borders
    outline: "bg-transparent border border-white/20 text-[#c5a065] hover:bg-white/5 active:bg-white/10",
    
    // Option - Used for Lists
    option: "bg-white text-gray-900 hover:bg-gray-50"
  };

  return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>{children}</button>;
};

export default Button;
