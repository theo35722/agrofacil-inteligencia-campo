
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FieldsHeaderProps {
  onAddFarm: () => void;
}

const FieldsHeader = ({ onAddFarm }: FieldsHeaderProps) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
        Lavouras e Talhões
      </h1>
      <p className="text-gray-600">
        Gerencie suas áreas de cultivo
      </p>
    </div>
    
    <Button 
      className="bg-agro-green-500 hover:bg-agro-green-600"
      onClick={onAddFarm}
    >
      <Plus className="h-4 w-4 mr-2" /> Nova Lavoura
    </Button>
  </div>
);

export default FieldsHeader;
