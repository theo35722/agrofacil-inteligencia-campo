
import React from "react";
import { MapPin, Info, Database, Zap } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";

export const AnalyzingState: React.FC = () => {
  const location = useGeolocation();
  
  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-16 h-16 border-4 border-agro-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-agro-green-800 font-medium mb-2">Analisando imagem...</p>
      
      <div className="w-full max-w-md bg-gray-50 border border-gray-100 rounded-lg p-4 mt-2">
        <p className="text-gray-700 font-medium text-sm mb-2">
          Nossa IA está analisando:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start text-sm text-gray-600">
            <Zap className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-agro-blue-500" />
            <span>Padrões de manchas, descoloração e formato das lesões</span>
          </li>
          <li className="flex items-start text-sm text-gray-600">
            <Database className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-agro-blue-500" />
            <span>Comparação com banco de dados de +5.000 doenças e pragas em plantas e pastagens</span>
          </li>
          <li className="flex items-start text-sm text-gray-600">
            <Zap className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-agro-blue-500" />
            <span>Análise específica para capim, pastagem e forrageiras</span>
          </li>
          {!location.error && !location.loading && (
            <li className="flex items-start text-sm text-gray-600">
              <MapPin className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-agro-blue-500" />
              <span>
                Processando dados de doenças comuns na sua região
              </span>
            </li>
          )}
          <li className="flex items-start text-sm text-gray-600">
            <Info className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-agro-blue-500" />
            <span>Calculando a precisão do diagnóstico</span>
          </li>
        </ul>
      </div>
      
      <div className="flex items-center mt-4 text-gray-500 text-sm">
        {location.loading ? (
          <span>Obtendo sua localização...</span>
        ) : location.error ? (
          <span>Analisando com base no nosso banco de dados global</span>
        ) : (
          <>
            <MapPin className="h-3.5 w-3.5 mr-1 text-agro-blue-500" />
            <span>
              Dados de localização considerados para resultados precisos
            </span>
          </>
        )}
      </div>
    </div>
  );
};
