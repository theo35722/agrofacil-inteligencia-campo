
import React from "react";
import { Camera, Image, Upload, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoTips } from "./PhotoTips";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useIsMobile from "@/hooks/use-mobile";

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
      <Collapsible
        open={showTips}
        onOpenChange={setShowTips}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-green-300 text-green-700 mb-4"
          >
            <Info className="h-4 w-4 mr-2" />
            {showTips ? "Ocultar dicas" : "Dicas para tirar a melhor foto"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          <PhotoTips />
        </CollapsibleContent>
      </Collapsible>
      
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
