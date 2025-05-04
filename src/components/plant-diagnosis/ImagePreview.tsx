
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ImagePreviewProps {
  imagePreview: string;
  resetDiagnosis: () => void;
  startAnalysis: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  imagePreview, 
  resetDiagnosis, 
  startAnalysis 
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden border border-agro-green-200">
        <img 
          src={imagePreview} 
          alt="Prévia da imagem" 
          className="w-full object-cover max-h-72"
        />
      </div>
      
      <div className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={resetDiagnosis}
        >
          Cancelar
        </Button>
        
        <Button 
          className="bg-agro-green-500 hover:bg-agro-green-600 flex-1"
          onClick={startAnalysis}
        >
          Analisar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
