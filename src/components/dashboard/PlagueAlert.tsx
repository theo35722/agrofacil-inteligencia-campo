
import React from "react";
import { AlertTriangle, CheckCircle, AlertCircle, Activity, Loader2 } from "lucide-react";
import { PlagueAlertData } from "@/types/agro";

interface PlagueAlertProps {
  alertData: PlagueAlertData;
  onClick?: () => void;
}

export const PlagueAlert: React.FC<PlagueAlertProps> = ({ alertData, onClick }) => {
  const { hasAlert, message, severity = "low" } = alertData;
  
  // Se a mensagem contém "aguardando" ou "verificando", mostrar estado de carregamento
  const isWaiting = message.toLowerCase().includes("aguardando") || 
                    message.toLowerCase().includes("verificando");
  
  if (!hasAlert) {
    return (
      <div 
        className="mx-4 p-3 bg-green-50 border-none rounded-lg cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          {isWaiting ? (
            <Loader2 className="w-5 h-5 text-green-500 flex-shrink-0 animate-spin" />
          ) : (
            <Activity className="w-5 h-5 text-green-500 flex-shrink-0" />
          )}
          <div>
            <h3 className="text-green-700 font-medium">Monitoramento de Pragas</h3>
            <p className="text-green-800 text-sm">
              {isWaiting ? "Monitoramento ativo. Aguarde enquanto analisamos as condições." : message}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Definir estilos com base na severidade
  const severityStyles = {
    low: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      desc: "text-amber-800",
      icon: <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
    },
    medium: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      desc: "text-orange-800",
      icon: <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
    },
    high: {
      bg: "bg-red-50",
      text: "text-red-700",
      desc: "text-red-800",
      icon: <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
    }
  };
  
  const style = severityStyles[severity];
  
  return (
    <div 
      className={`mx-4 p-3 ${style.bg} border-none rounded-lg cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {style.icon}
        <div>
          <h3 className={`${style.text} font-medium`}>Alerta de Pragas</h3>
          <p className={`${style.desc} text-sm`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
