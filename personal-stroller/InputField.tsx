
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

const InputField: React.FC<InputFieldProps> = ({ icon: Icon, className = '', ...props }) => {
  return (
    <div className={`relative w-full mb-5 group ${className}`}>
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-400 transition-colors pointer-events-none z-10">
          <Icon size={18} />
        </div>
      )}
      <input 
        {...props} 
        className={`w-full glass-input py-4 ${Icon ? 'pl-12' : 'pl-4'} pr-4 rounded-2xl outline-none focus:border-gold-400/50 focus:bg-white/10 transition-all placeholder:text-gray-500/80 text-white shadow-inner`} 
      />
    </div>
  );
};

export default InputField;
