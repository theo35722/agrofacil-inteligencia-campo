
import React from "react";

interface SeuZeIconProps {
  size?: number;
  className?: string;
}

export const SeuZeIcon: React.FC<SeuZeIconProps> = ({ 
  size = 48, 
  className = "" 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 96 96" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform hover:scale-105`}
    >
      {/* Background Circle */}
      <circle cx="48" cy="48" r="48" fill="#F2FCE2" />
      
      {/* Straw Hat */}
      <path d="M20 38C20 32 30 18 48 18C66 18 76 32 76 38C76 44 20 44 20 38Z" fill="#FEF7CD" />
      <path d="M30 38C36 36 60 36 66 38C66 38 60 42 48 42C36 42 30 38 30 38Z" fill="#E9D18A" />
      
      {/* Face */}
      <circle cx="48" cy="54" r="24" fill="#FDE1D3" />
      
      {/* Eyes - Animated Effect */}
      <g>
        <ellipse cx="40" cy="50" rx="3" ry="4" fill="#333333" />
        <ellipse cx="56" cy="50" rx="3" ry="4" fill="#333333" />
      </g>
      
      {/* Eyebrows */}
      <path d="M36 46C38 44 42 44 44 46" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M52 46C54 44 58 44 60 46" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Mustache - More detailed */}
      <path d="M38 62C41 58 55 58 58 62" stroke="#8E9196" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 64C39 60 57 60 60 64" stroke="#8E9196" strokeWidth="2" strokeLinecap="round" />
      
      {/* Mouth/Smile - Friendly expression */}
      <path d="M38 68C41 72 55 72 58 68" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
      
      {/* Wrinkles for character */}
      <path d="M38 58C39 56 41 55 43 56" stroke="#E8C3B0" strokeWidth="1" strokeLinecap="round" />
      <path d="M53 56C55 55 57 56 58 58" stroke="#E8C3B0" strokeWidth="1" strokeLinecap="round" />
      
      {/* Shirt Collar */}
      <path d="M30 76C34 84 62 84 66 76" fill="#4CAF50" />
      
      {/* Shirt Pattern (Checkered) - More detailed */}
      <path d="M36 76L38 80M42 76L44 80M48 76L50 80M54 76L56 80M60 76L62 80" stroke="#F97316" strokeWidth="1.5" />
      <path d="M40 76L42 80M46 76L48 80M52 76L54 80M58 76L60 80" stroke="#E9D18A" strokeWidth="1.5" />
    </svg>
  );
};

export default SeuZeIcon;
