
import React from "react";
import { Camera, Image, Upload, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PhotoTips } from "./PhotoTips";

interface ImageUploadAreaProps {
  captureImage: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({ 
  captureImage, 
  handleImageUpload 
}) => {
  return (
    <div className="space-y-6">
      <Alert className="bg-agro-green-50 border-agro-green-100">
        <Info className="h-4 w-4 text-agro-green-600" />
        <AlertTitle className="text-agro-green-700">Para melhores resultados</AlertTitle>
        <AlertDescription className="text-gray-700 text-sm">
          Tire a foto com luz natural, focando na área afetada da planta, sem fundo confuso. 
          Mantenha a câmera estável e próxima ao problema.
        </AlertDescription>
      </Alert>
      
      <div 
        className="border-2 border-dashed border-agro-green-300 rounded-lg p-8
          flex flex-col items-center justify-center text-center bg-agro-green-50"
      >
        <Image className="h-16 w-16 text-agro-green-400 mb-4" />
        <p className="text-agro-green-800 font-medium">
          Envie uma imagem da planta para diagnóstico
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Tire uma foto clara e bem iluminada da área afetada
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Button 
            variant="outline" 
            className="w-full h-20 border-agro-green-300 mb-2"
            onClick={captureImage}
          >
            <div className="flex flex-col items-center">
              <Camera className="h-6 w-6 mb-1 text-agro-green-600" />
              <span>Tirar foto</span>
            </div>
          </Button>
        </div>
        
        <div>
          <Button
            variant="outline"
            className="w-full h-20 border-agro-green-300 mb-2"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <div className="flex flex-col items-center">
              <Upload className="h-6 w-6 mb-1 text-agro-green-600" />
              <span>Enviar foto</span>
            </div>
          </Button>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      
      <PhotoTips />
    </div>
  );
};
