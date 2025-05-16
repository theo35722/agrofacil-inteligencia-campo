
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface PlagueAlertProps {
  hasAlert: boolean;
  message: string;
  onClick?: () => void;
}

export const PlagueAlert: React.FC<PlagueAlertProps> = ({ hasAlert, message, onClick }) => {
  if (!hasAlert && message === "Nenhum alerta de pragas no momento") {
    return (
      <div 
        className="mx-4 p-3 bg-green-50 border-none rounded-lg cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="text-green-700 font-medium">Monitoramento de Pragas</h3>
            <p className="text-green-800 text-sm">
              {message}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!hasAlert) return null;
  
  return (
    <div 
      className="mx-4 p-3 bg-amber-50 border-none rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
        <div>
          <h3 className="text-orange-700 font-medium">Praga Alerta</h3>
          <p className="text-orange-800 text-sm">
            Atenção em <span className="font-medium">{message}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
