
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
  className?: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen, className = "" }) => {
  const [showPulse, setShowPulse] = useState(false);
  const [showTip, setShowTip] = useState(false);
  
  // Mostrar a dica após 5 segundos se o chat não foi aberto ainda
  useEffect(() => {
    const tipTimer = setTimeout(() => {
      if (!isOpen) {
        setShowTip(true);
        
        // Esconder a dica após 5 segundos
        const hideTipTimer = setTimeout(() => {
          setShowTip(false);
        }, 5000);
        
        return () => clearTimeout(hideTipTimer);
      }
    }, 5000);
    
    return () => clearTimeout(tipTimer);
  }, [isOpen]);
  
  // Efeito de pulsar a cada 30 segundos
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      if (!isOpen) {
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 2000);
      }
    }, 30000);
    
    return () => clearInterval(pulseInterval);
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-36 right-4 z-50 bg-white p-3 rounded-lg shadow-lg max-w-xs border border-agro-green-200"
          >
            <button 
              onClick={() => setShowTip(false)}
              className="absolute -top-2 -right-2 bg-gray-100 rounded-full p-1 border border-gray-300"
            >
              <X size={12} />
            </button>
            <p className="text-sm">
              Precisa de ajuda com sua lavoura? Converse com o Seu Zé!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={onClick}
        className={`fixed bottom-16 right-4 z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all ${className} ${
          showPulse ? "animate-bounce" : ""
        }`}
        aria-label="Abrir chat com Seu Zé"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping" />
          <div className="relative z-10 w-16 h-16">
            <img 
              src="/lovable-uploads/8ac540a4-ed74-4c29-98a2-22f75a415068.png" 
              alt="Seu Zé" 
              className="w-full h-full object-cover rounded-full" 
            />
          </div>
        </div>
      </button>
    </>
  );
};

export default ChatButton;
