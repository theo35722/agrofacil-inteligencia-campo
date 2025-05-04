
import React from "react";

export const AnalyzingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-16 h-16 border-4 border-agro-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-agro-green-800 font-medium">Analisando imagem...</p>
      <p className="text-gray-500 text-sm mt-2">
        Nossa IA está identificando possíveis problemas
      </p>
    </div>
  );
};
