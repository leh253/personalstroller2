import React from 'react';

interface LogoProps {
  size?: 'small' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'large', className = '' }) => {
  const isSmall = size === 'small';
  return (
    <div className={`flex flex-col items-center ${isSmall ? 'flex-row gap-4 mb-0' : 'mb-6'} ${className}`}>
      <div className={`relative rounded-full border-2 border-gold-400 flex items-center justify-center bg-navy-900 overflow-hidden shadow-[0_0_20px_rgba(197,160,101,0.2)] ${isSmall ? 'w-12 h-12 border' : 'w-24 h-24 mb-6'}`}>
        <img src="https://www.image-heberg.fr/files/17614987662851851592.png" alt="Logo" className="w-full h-full object-contain p-2" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=PS'; }} />
      </div>
      <div>
        <h1 className={`font-bold tracking-[0.15em] bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm ${isSmall ? 'text-xl leading-none' : 'text-3xl'}`}>PERSONAL</h1>
        <p className={`text-gold-400 italic font-light tracking-widest opacity-80 ${isSmall ? 'text-[10px] leading-none mt-1' : 'text-sm mt-1'}`}>stroller selection</p>
      </div>
    </div>
  );
};

export default Logo;