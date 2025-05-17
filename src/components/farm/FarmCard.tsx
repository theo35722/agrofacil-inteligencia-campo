
import React from "react";
import { MapPin, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Talhao } from "@/types/agro";
import FarmPlots from "./FarmPlots";

interface FarmCardProps {
  id: string;
  name: string;
  area: number | null | undefined;
  location: string | null | undefined;
  plots: Talhao[];
  expandedFarm: string | null;
  toggleFarmExpand: (farmId: string) => void;
  openAddPlotDialog: (farmId: string) => void;
}

const FarmCard = ({
  id,
  name,
  area,
  location,
  plots,
  expandedFarm,
  toggleFarmExpand,
  openAddPlotDialog,
}: FarmCardProps) => {
  const isExpanded = expandedFarm === id;

  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-agro-earth-600" />
            <span className="text-agro-green-800">{name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => toggleFarmExpand(id)}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm mb-3">
          <div>
            <span className="text-gray-500">Área:</span>
            <p className="font-medium">{area} ha</p>
          </div>
          <div>
            <span className="text-gray-500">Culturas:</span>
            <p className="font-medium">{name || "-"}</p>
          </div>
          <div>
            <span className="text-gray-500">Localização:</span>
            <p className="font-medium">{location || "-"}</p>
          </div>
        </div>
        
        {isExpanded && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-agro-green-700">Talhões</h4>
              
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs border-agro-green-300 text-agro-green-700 hover:bg-agro-green-50"
                onClick={() => openAddPlotDialog(id)}
              >
                <Plus className="h-3 w-3 mr-1" /> 
                Adicionar Talhão
              </Button>
            </div>
            
            <FarmPlots plots={plots} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FarmCard;
