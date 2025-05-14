
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Image, X } from "lucide-react";
import { CameraCapture } from "../../plant-diagnosis/CameraCapture";

export interface ProductImageUploadProps {
  imagePreview?: string | null;
  onImageCapture?: (imageDataUrl: string) => void;
  onImageRemove?: () => void;
  onChange?: (value: string | null) => void;
  value?: string | null;
  existingImageUrl?: string | null;
}

export const ProductImageUpload = ({
  imagePreview: propImagePreview,
  onImageCapture,
  onImageRemove,
  onChange,
  value,
  existingImageUrl,
}: ProductImageUploadProps) => {
  const [showCamera, setShowCamera] = useState(false);
  // Use the provided value or existingImageUrl as the image preview
  const imagePreview = value || propImagePreview || existingImageUrl;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageCapture = (imageDataUrl: string) => {
    // Call both handlers if they exist
    if (onChange) onChange(imageDataUrl);
    if (onImageCapture) onImageCapture(imageDataUrl);
    setShowCamera(false);
  };

  const handleRemove = () => {
    // Call both handlers if they exist
    if (onChange) onChange(null);
    if (onImageRemove) onImageRemove();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      if (onChange) onChange(imageDataUrl);
      if (onImageCapture) onImageCapture(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  if (showCamera) {
    return <CameraCapture onCapture={handleImageCapture} onClose={() => setShowCamera(false)} />;
  }

  return (
    <div>
      <Label className="block mb-2">Foto do Produto*</Label>
      
      {imagePreview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <div className="flex items-center justify-center bg-gray-50">
            <img 
              src={imagePreview} 
              alt="Prévia do produto" 
              className="w-full h-auto max-h-64 object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          
          <Button
            type="button"
            variant="outline"
            className="w-full h-16 bg-gray-50 flex flex-col items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="w-5 h-5 mb-1 text-agro-green-600" />
            <span className="text-sm">Escolher da Galeria</span>
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full h-16 bg-gray-50 flex flex-col items-center justify-center"
            onClick={() => setShowCamera(true)}
          >
            <Camera className="w-5 h-5 mb-1 text-agro-green-600" />
            <span className="text-sm">Tirar Foto</span>
          </Button>
        </div>
      )}
    </div>
  );
};
