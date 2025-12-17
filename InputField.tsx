import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

const InputField: React.FC<Props> = ({ icon: Icon, className = '', ...props }) => (
  <div className={`relative w-full mb-4 group ${className}`}>
    {Icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#c5a065] transition-colors z-10"><Icon size={18} /></div>}
    <input {...props} className={`w-full glass-input py-4 ${Icon ? 'pl-12' : 'pl-4'} pr-4 rounded-2xl outline-none focus:border-[#c5a065]/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-500`} />
  </div>
);
export default InputField;