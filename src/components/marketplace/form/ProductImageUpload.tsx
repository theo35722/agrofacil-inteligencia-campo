
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, X } from "lucide-react";
import { CameraCapture } from "../../plant-diagnosis/CameraCapture";

interface ProductImageUploadProps {
  imagePreview: string | null;
  onImageCapture: (imageDataUrl: string) => void;
  onImageRemove: () => void;
}

export const ProductImageUpload = ({ 
  imagePreview, 
  onImageCapture, 
  onImageRemove 
}: ProductImageUploadProps) => {
  const [showCamera, setShowCamera] = useState(false);
  
  const handleImageCapture = (imageDataUrl: string) => {
    onImageCapture(imageDataUrl);
    setShowCamera(false);
  };

  if (showCamera) {
    return <CameraCapture onCapture={handleImageCapture} onClose={() => setShowCamera(false)} />;
  }

  return (
    <div>
      <Label className="block mb-2">Foto do Produto*</Label>
      
      {imagePreview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img 
            src={imagePreview} 
            alt="Prévia do produto" 
            className="w-full h-auto max-h-64 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onImageRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-32 bg-gray-50 flex flex-col items-center justify-center"
          onClick={() => setShowCamera(true)}
        >
          <Camera className="w-6 h-6 mb-2 text-agro-green-600" />
          <span>Tirar Foto do Produto</span>
        </Button>
      )}
    </div>
  );
};
