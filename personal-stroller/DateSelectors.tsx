
import React from 'react';
import { MONTHS } from './constants.ts';

interface DateSelectorsProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  type?: 'past' | 'future';
}

const DateSelectors: React.FC<DateSelectorsProps> = ({ value, onChange, label, type = 'past' }) => {
  const [yearVal, monthVal, dayVal] = value ? value.split('-') : ['', '', ''];
  const currentYear = new Date().getFullYear();
  
  const years = type === 'future' 
    ? Array.from({ length: 3 }, (_, i) => currentYear + i) 
    : Array.from({ length: 80 }, (_, i) => currentYear - i);
    
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (field: 'day' | 'month' | 'year', val: string) => {
    const y = field === 'year' ? val : (yearVal || currentYear.toString());
    const m = field === 'month' ? val : (monthVal || '01');
    const d = field === 'day' ? val : (dayVal || '01');
    onChange(`${y}-${m}-${d}`);
  };

  const selectClass = "w-full glass-input py-4 px-3 rounded-2xl outline-none focus:border-gold-400/50 focus:bg-white/10 text-sm appearance-none transition-all shadow-inner";
  
  const arrowBg = {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='white' stroke-opacity='0.5' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: `right 0.5rem center`,
    backgroundRepeat: `no-repeat`,
    backgroundSize: `1.5em 1.5em`,
    paddingRight: `2.5rem`
  };

  return (
    <div className="mb-5 w-full">
      {label && <p className="text-[10px] text-gray-500 mb-2 ml-1 tracking-widest uppercase font-bold">{label}</p>}
      <div className="flex gap-2">
        <div className="relative flex-[0.8]">
           <select 
            style={arrowBg}
            className={selectClass} 
            value={dayVal} 
            onChange={e => handleChange('day', e.target.value)}
          >
             <option value="" disabled className="bg-navy-900 text-gray-400">Jour</option>
             {days.map(d => (
               <option key={d} value={d.toString().padStart(2, '0')} className="bg-navy-900 text-white">{d}</option>
             ))}
           </select>
        </div>
        <div className="relative flex-1">
           <select 
            style={arrowBg}
            className={selectClass} 
            value={monthVal} 
            onChange={e => handleChange('month', e.target.value)}
          >
             <option value="" disabled className="bg-navy-900 text-gray-400">Mois</option>
             {MONTHS.map((m, i) => (
               <option key={i} value={(i+1).toString().padStart(2, '0')} className="bg-navy-900 text-white">{m}</option>
             ))}
           </select>
        </div>
        <div className="relative flex-1">
           <select 
            style={arrowBg}
            className={selectClass} 
            value={yearVal} 
            onChange={e => handleChange('year', e.target.value)}
          >
             <option value="" disabled className="bg-navy-900 text-gray-400">Année</option>
             {years.map(y => (
               <option key={y} value={y.toString()} className="bg-navy-900 text-white">{y}</option>
             ))}
           </select>
        </div>
      </div>
    </div>
  );
};

export default DateSelectors;
