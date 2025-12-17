import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', disabled, className = '', type = 'button' }) => {
  const base = "w-full py-4 rounded-xl font-bold tracking-widest text-[10px] uppercase transition-all duration-300 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center";
  const styles = {
    primary: "bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/20 border-t border-white/20 hover:brightness-110",
    outline: "border border-white/10 bg-white/5 text-gold-400 hover:bg-white/10"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};
export default Button;