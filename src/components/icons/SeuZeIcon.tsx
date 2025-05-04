
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
      {/* Background Circle - Brighter green background */}
      <circle cx="48" cy="48" r="48" fill="#E8F5E1" />
      
      {/* Straw Hat - Made slightly bigger */}
      <path d="M18 36C18 30 30 16 48 16C66 16 78 30 78 36C78 42 18 42 18 36Z" fill="#FEF7CD" />
      <path d="M30 36C36 34 60 34 66 36C66 36 60 40 48 40C36 40 30 36 30 36Z" fill="#E9D18A" />
      
      {/* Face - Warmer tone */}
      <circle cx="48" cy="54" r="24" fill="#FFDCC3" />
      
      {/* Eyes - More expressive */}
      <g>
        <ellipse cx="40" cy="50" rx="3" ry="4" fill="#333333" />
        <ellipse cx="56" cy="50" rx="3" ry="4" fill="#333333" />
        <path d="M39 48C39 47.4477 39.4477 47 40 47C40.5523 47 41 47.4477 41 48C41 48.5523 40.5523 49 40 49C39.4477 49 39 48.5523 39 48Z" fill="white" />
        <path d="M55 48C55 47.4477 55.4477 47 56 47C56.5523 47 57 47.4477 57 48C57 48.5523 56.5523 49 56 49C55.4477 49 55 48.5523 55 48Z" fill="white" />
      </g>
      
      {/* Eyebrows - More expressive */}
      <path d="M36 45C38 43 42 43 44 45" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M52 45C54 43 58 43 60 45" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Mustache - Fuller and more detailed */}
      <path d="M38 62C41 58 55 58 58 62" stroke="#8E9196" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 64C39 60 57 60 60 64" stroke="#8E9196" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 66C37 62 59 62 62 66" stroke="#8E9196" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Mouth/Smile - Friendlier expression */}
      <path d="M38 69C41 73 55 73 58 69" stroke="#333333" strokeWidth="2" strokeLinecap="round" />
      
      {/* Wrinkles for character */}
      <path d="M38 58C39 56 41 55 43 56" stroke="#E8C3B0" strokeWidth="1" strokeLinecap="round" />
      <path d="M53 56C55 55 57 56 58 58" stroke="#E8C3B0" strokeWidth="1" strokeLinecap="round" />
      
      {/* Shirt Collar */}
      <path d="M30 78C34 86 62 86 66 78" fill="#4CAF50" />
      
      {/* Shirt Pattern - Checkered with brighter colors */}
      <path d="M36 76L38 80M42 76L44 80M48 76L50 80M54 76L56 80M60 76L62 80" stroke="#F97316" strokeWidth="1.5" />
      <path d="M40 76L42 80M46 76L48 80M52 76L54 80M58 76L60 80" stroke="#E9D18A" strokeWidth="1.5" />
    </svg>
  );
};

export default SeuZeIcon;
