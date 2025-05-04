
import React from "react";
import SeuZeIcon from "../icons/SeuZeIcon";

interface ChatButtonProps {
  onClick: () => void;
  className?: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-16 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-agro-green-500 shadow-lg hover:bg-agro-green-600 transition-all hover:scale-105 ${className}`}
      aria-label="Abrir chat com Seu Zé"
    >
      <div className="relative">
        <SeuZeIcon size={42} />
      </div>
    </button>
  );
};

export default ChatButton;
