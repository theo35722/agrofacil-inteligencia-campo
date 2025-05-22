
import React from "react";

interface AgroFacilIconProps {
  size?: number;
  className?: string;
}

export const AgroFacilIcon: React.FC<AgroFacilIconProps> = ({ 
  size = 48, 
  className = "" 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 192 192" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Fundo verde */}
      <rect width="192" height="192" fill="#2E7D32" />
      
      {/* Ícone de folha estilizado em branco */}
      <path 
        d="M96 48C80 48 58 60 58 100C90 100 96 82 96 82C96 82 102 100 134 100C134 60 112 48 96 48Z" 
        fill="white" 
        stroke="white" 
        strokeWidth="2"
      />
      <path 
        d="M96 144C96 144 96 104 96 82" 
        stroke="white" 
        strokeWidth="10" 
        strokeLinecap="round"
      />
      <path 
        d="M80 116C80 116 86 122 96 122C106 122 112 116 112 116" 
        stroke="white" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AgroFacilIcon;
