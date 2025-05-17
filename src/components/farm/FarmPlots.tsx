
import React from "react";
import { Talhao } from "@/types/agro";

interface FarmPlotsProps {
  plots: Talhao[];
}

const FarmPlots = ({ plots }: FarmPlotsProps) => {
  if (plots.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        Não há talhões cadastrados para esta lavoura
      </p>
    );
  }
  
  return (
    <div className="space-y-2">
      {plots.map((plot) => (
        <div 
          key={plot.id} 
          className="p-3 bg-agro-earth-50 border border-agro-earth-100 rounded-md"
        >
          <div className="flex justify-between items-center">
            <h5 className="font-medium text-agro-earth-800">
              {plot.nome}
            </h5>
            <span className="text-sm text-agro-earth-600">
              {plot.area} ha
            </span>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            {plot.cultura && (<p>Cultura: {plot.cultura}</p>)}
            {plot.fase && (<p>Fase: {plot.fase}</p>)}
            {plot.variedade && (<p>Variedade: {plot.variedade}</p>)}
            {plot.data_plantio && (
              <p>Plantio: {new Date(plot.data_plantio).toLocaleDateString('pt-BR')}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FarmPlots;
