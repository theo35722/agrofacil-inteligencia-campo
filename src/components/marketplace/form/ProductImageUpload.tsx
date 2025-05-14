
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { CameraCapture } from "@/components/plant-diagnosis/CameraCapture";
import { toast } from "sonner";

export interface ProductImageUploadProps {
  imagePreview?: string | null;
  onImageCapture: (imageDataUrl: string) => void;
  onImageRemove: () => void;
  onChange?: (value: string) => void;
  value?: string;
  existingImageUrl?: string | null;
}

export function ProductImageUpload({ 
  imagePreview, 
  onImageCapture, 
  onImageRemove,
  onChange,
  value,
  existingImageUrl
}: ProductImageUploadProps) {
  const [showCamera, setShowCamera] = useState(false);
  
  const displayedImage = imagePreview || existingImageUrl || value;
  
  const handleCameraCapture = (imageDataUrl: string) => {
    onImageCapture(imageDataUrl);
    if (onChange) {
      onChange(imageDataUrl);
    }
    setShowCamera(false);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Formato inválido", {
        description: "Por favor, selecione uma imagem válida."
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande", {
        description: "A imagem deve ter no máximo 5MB."
      });
      return;
    }
    
    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageCapture(base64String);
      if (onChange) {
        onChange(base64String);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleGalleryClick = () => {
    // Trigger hidden file input
    document.getElementById('product-image-upload')?.click();
  };
  
  return (
    <div className="space-y-4">
      {showCamera ? (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      ) : (
        <>
          {displayedImage ? (
            <div className="relative">
              <img 
                src={displayedImage} 
                alt="Prévia da imagem" 
                className="w-full h-56 object-contain border rounded-lg"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 rounded-full h-8 w-8"
                onClick={() => {
                  onImageRemove();
                  if (onChange) {
                    onChange('');
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-16 border-dashed border-2 flex flex-col items-center justify-center space-y-1 px-2 py-6"
                onClick={() => setShowCamera(true)}
              >
                <Camera className="h-6 w-6 text-gray-500" />
                <span className="text-xs text-gray-500">Tirar Foto</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="h-16 border-dashed border-2 flex flex-col items-center justify-center space-y-1 px-2 py-6"
                onClick={handleGalleryClick}
              >
                <Upload className="h-6 w-6 text-gray-500" />
                <span className="text-xs text-gray-500">Galeria</span>
              </Button>
              
              <input 
                type="file" 
                id="product-image-upload"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
          
          <p className="text-xs text-gray-500 text-center">
            Adicione uma foto clara do seu produto
          </p>
        </>
      )}
    </div>
  );
}
