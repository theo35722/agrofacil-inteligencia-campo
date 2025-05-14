
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, X } from "lucide-react";
import { CameraCapture } from "../../plant-diagnosis/CameraCapture";

export interface ProductImageUploadProps {
  imagePreview?: string | null;
  onImageCapture?: (imageDataUrl: string) => void;
  onImageRemove?: () => void;
  // Add these props to match what's passed from the form
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
            onClick={handleRemove}
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
