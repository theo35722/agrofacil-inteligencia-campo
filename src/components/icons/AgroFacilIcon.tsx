
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
      <rect width="512" height="512" fill="#2E7D32" />
      
      {/* Ícone de folhas estilizado em branco */}
      <path
        d="M256 128C204.8 128 153.6 179.2 153.6 307.2C256 307.2 256 256 256 256C256 256 256 307.2 358.4 307.2C358.4 179.2 307.2 128 256 128Z"
        fill="white"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M214.4 128C171.52 128 128.64 166.4 128.64 268.8C214.4 268.8 214.4 230.4 214.4 230.4C214.4 230.4 214.4 268.8 300.16 268.8C300.16 166.4 257.28 128 214.4 128Z"
        fill="#2E7D32"
        stroke="#2E7D32"
        strokeWidth="2"
      />
      <path
        d="M256 384C256 384 256 307.2 256 256"
        stroke="white"
        strokeWidth="16"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AgroFacilIcon;
