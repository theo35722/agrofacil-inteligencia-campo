
import React from 'react';
import { Map, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LocationDisplayProps {
  locationName: string | null;
  isLoading: boolean;
  error: string | null;
  onClear: () => void;
  label?: string;
  loadingMessage?: string;
  errorMessage?: string;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ 
  locationName, 
  isLoading, 
  error, 
  onClear,
  label = "Sua localização",
  loadingMessage = "Carregando localização...",
  errorMessage = "Localização não disponível. Permissão negada."
}) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center mb-2">
        <Map className="w-5 h-5 text-gray-500 mr-2" />
        <Label className="text-base font-medium">{label}</Label>
      </div>
      
      {locationName ? (
        <div className="bg-green-50 p-3 rounded-lg flex items-center justify-between">
          <span className="text-green-800">{locationName}</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClear}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          {error 
            ? errorMessage
            : isLoading 
              ? loadingMessage
              : "Localização não disponível."}
        </p>
      )}
    </div>
  );
};
