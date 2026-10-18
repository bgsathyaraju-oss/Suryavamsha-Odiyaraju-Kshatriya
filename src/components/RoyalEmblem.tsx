import React from 'react';

interface RoyalEmblemProps {
  className?: string;
  size?: number;
}

export const RoyalEmblem: React.FC<RoyalEmblemProps> = ({ className = '', size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      <defs>
        <radialGradient id="sunGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF2A3" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8A6715" />
        </radialGradient>
        <linearGradient id="shieldRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#800D1E" />
          <stop offset="50%" stopColor="#5E0713" />
          <stop offset="100%" stopColor="#3C030B" />
        </linearGradient>
      </defs>

      {/* Outer Royal Seal Ring */}
      <circle cx="60" cy="60" r="56" fill="url(#shieldRed)" stroke="#D4AF37" strokeWidth="3" />
      <circle cx="60" cy="60" r="51" stroke="#F3E5AB" strokeWidth="1" strokeDasharray="3 2" />

      {/* Surya / Sun Rays (Suryavamsha Solar Dynasty Symbol) */}
      <g stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round">
        <line x1="60" y1="14" x2="60" y2="25" />
        <line x1="60" y1="95" x2="60" y2="106" />
        <line x1="14" y1="60" x2="25" y2="60" />
        <line x1="95" y1="60" x2="106" y2="60" />
        <line x1="27" y1="27" x2="36" y2="36" />
        <line x1="84" y1="84" x2="93" y2="93" />
        <line x1="27" y1="93" x2="36" y2="84" />
        <line x1="84" y1="36" x2="93" y2="27" />
      </g>

      {/* Royal Sun Face & Crown */}
      <circle cx="60" cy="60" r="26" fill="url(#sunGold)" stroke="#FFF2A3" strokeWidth="1.5" />
      
      {/* Royal Crown / Kshatriya Diadem */}
      <path 
        d="M48 53 L52 46 L60 50 L68 46 L72 53 Z" 
        fill="#800D1E" 
        stroke="#FFF" 
        strokeWidth="0.8" 
      />

      {/* Traditional Tilak (Kshatriya Vermilion Mark) */}
      <path 
        d="M59 55 Q60 52 61 55 L60.6 62 Q60 63 59.4 62 Z" 
        fill="#800D1E" 
      />
      <circle cx="60" cy="64.5" r="1.2" fill="#800D1E" />

      {/* Traditional Sun Eyes and Smile */}
      <path d="M52 61 Q55 60 57 62" stroke="#5E0713" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M63 62 Q65 60 68 61" stroke="#5E0713" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M56 68 Q60 72 64 68" stroke="#5E0713" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
};
