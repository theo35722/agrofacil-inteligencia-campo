
import React, { useState } from "react";
import { Talhao } from "@/types/agro";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditTalhaoDialog } from "@/components/talhao/EditTalhaoDialog";

interface FarmPlotsProps {
  plots: Talhao[];
  onUpdateSuccess: () => void;
}

const FarmPlots = ({ plots, onUpdateSuccess }: FarmPlotsProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTalhao, setCurrentTalhao] = useState<Talhao | null>(null);
  
  const handleEditClick = (talhao: Talhao) => {
    setCurrentTalhao(talhao);
    setEditDialogOpen(true);
  };

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
            <div className="flex items-center gap-2">
              <span className="text-sm text-agro-earth-600">
                {plot.area} ha
              </span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => handleEditClick(plot)}
              >
                <Pencil className="h-4 w-4 text-agro-earth-600" />
                <span className="sr-only">Editar</span>
              </Button>
            </div>
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
      
      {/* Edit dialog */}
      <EditTalhaoDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        talhao={currentTalhao}
        onSuccess={onUpdateSuccess}
      />
    </div>
  );
};

export default FarmPlots;
