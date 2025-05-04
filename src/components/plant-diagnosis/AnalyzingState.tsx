
import React from "react";
import { MapPin } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";

export const AnalyzingState: React.FC = () => {
  const location = useGeolocation();
  
  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-16 h-16 border-4 border-agro-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-agro-green-800 font-medium">Analisando imagem...</p>
      
      <div className="flex items-center mt-2 text-gray-500 text-sm">
        {location.loading ? (
          <span>Obtendo sua localização...</span>
        ) : location.error ? (
          <span>Analisando com base no nosso banco de dados global</span>
        ) : (
          <>
            <MapPin className="h-3.5 w-3.5 mr-1 text-agro-blue-500" />
            <span>
              Dados de localização coletados para análise precisa
            </span>
          </>
        )}
      </div>
    </div>
  );
};
