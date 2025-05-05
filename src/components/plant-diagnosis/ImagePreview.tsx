
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImagePreviewProps {
  preview: string;
  onCancel: () => void;
  onAnalyze: () => void;
  loading?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  preview, 
  onCancel, 
  onAnalyze,
  loading = false
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden border border-green-200 shadow-sm">
        <img 
          src={preview} 
          alt="Prévia da imagem" 
          className={`w-full object-cover ${isMobile ? 'max-h-56' : 'max-h-72'}`}
        />
      </div>
      
      <div className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          className="flex-1 border-gray-300"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button 
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-6 font-medium"
          onClick={onAnalyze}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="mr-2">Analisando</span>
              <LoaderCircle className="h-5 w-5 animate-spin" />
            </span>
          ) : (
            <>
              Analisar <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;
