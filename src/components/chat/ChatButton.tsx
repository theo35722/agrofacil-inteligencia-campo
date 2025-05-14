
import React, { useState, useEffect } from "react";
import { X, Bot } from "lucide-react";
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
  
  // Efeito de pulsar a cada 30 segundos e no carregamento da página
  useEffect(() => {
    // Pulsar imediatamente no carregamento
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 2000);
    
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
              Precisa de ajuda com sua lavoura? Converse com o Seu Calunga!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={onClick}
        className={`fixed bottom-20 md:bottom-16 right-4 z-50 flex items-center justify-center w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all ${className} ${
          showPulse ? "animate-pulse" : ""
        }`}
        aria-label="Abrir chat com Seu Calunga"
      >
        <div className="relative">
          {showPulse && (
            <div className="absolute inset-0 rounded-full bg-agro-green-300 opacity-30 animate-ping"></div>
          )}
          <div className="relative z-10 w-20 h-20 p-1">
            <div className="absolute bottom-0 right-0 bg-agro-green-500 p-1.5 rounded-full z-20 border-2 border-white">
              <Bot size={18} className="text-white" />
            </div>
            <img 
              src="/lovable-uploads/8ac540a4-ed74-4c29-98a2-22f75a415068.png" 
              alt="Seu Calunga" 
              className="w-full h-full object-cover rounded-full border-4 border-agro-green-200" 
            />
          </div>
        </div>
      </button>
    </>
  );
};

export default ChatButton;
