
import React from "react";
import { AlertCircle } from "lucide-react";

interface ActivityErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ActivityErrorState: React.FC<ActivityErrorStateProps> = ({ 
  error, 
  onRetry 
}) => {
  return (
    <div className="py-2 px-3 text-sm text-red-500 flex flex-col items-center">
      <AlertCircle className="h-5 w-5 mb-1" />
      <p>{error}</p>
      <button 
        onClick={onRetry}
        className="mt-2 text-xs text-green-600 hover:text-green-700"
      >
        Tentar novamente
      </button>
    </div>
  );
};
