
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
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Fundo verde */}
      <rect width="512" height="512" fill="#1E7F3D" />
      
      {/* Ícone da folha branca */}
      <path 
        d="M256 128C160 128 128 256 128 384C160 384 192 352 256 352C320 352 352 384 384 384C384 256 352 128 256 128Z" 
        fill="white" 
        strokeWidth="0"
      />
      <path 
        d="M192 128C128 160 128 288 128 384" 
        stroke="white" 
        strokeWidth="16" 
        strokeLinecap="round"
      />
      <path 
        d="M224 224C256 192 320 192 352 224" 
        stroke="#1E7F3D" 
        strokeWidth="16" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AgroFacilIcon;
