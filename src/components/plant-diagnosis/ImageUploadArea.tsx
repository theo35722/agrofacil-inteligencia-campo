
import React from "react";
import { Camera, Image, Upload, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoTips } from "./PhotoTips";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageUploadAreaProps {
  captureImage: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showTips: boolean;
  setShowTips: (show: boolean) => void;
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({ 
  captureImage, 
  handleImageUpload,
  showTips,
  setShowTips
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      {/* Show photo tips by default, but user can collapse them */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Info className="h-4 w-4 text-green-600 mr-2" />
            <h3 className="text-green-700 font-medium">Dicas para tirar a melhor foto</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-green-700 hover:bg-green-100"
            onClick={() => setShowTips(!showTips)}
          >
            {showTips ? "Ocultar" : "Mostrar"}
          </Button>
        </div>
        
        <Collapsible
          open={showTips}
          onOpenChange={setShowTips}
          className="w-full"
        >
          <CollapsibleContent>
            <PhotoTips />
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <div 
        className="border-2 border-dashed border-green-300 rounded-lg p-6 sm:p-8
          flex flex-col items-center justify-center text-center bg-green-50"
      >
        <Image className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} text-green-400 mb-4`} />
        <p className="text-green-800 font-medium">
          Envie uma imagem da planta
        </p>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Foto clara e bem iluminada da área afetada
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-16 sm:h-20 border-green-300 w-full"
          onClick={captureImage}
        >
          <div className="flex flex-col items-center">
            <Camera className="h-5 w-5 mb-1 text-green-600" />
            <span className="text-sm">Tirar foto</span>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="h-16 sm:h-20 border-green-300 w-full"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-5 w-5 mb-1 text-green-600" />
            <span className="text-sm">Enviar foto</span>
          </div>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </Button>
      </div>
    </div>
  );
};

export default ImageUploadArea;
