
import React, { useState } from "react";
import ImageUploadArea from "@/components/plant-diagnosis/ImageUploadArea";
import ImagePreview from "@/components/plant-diagnosis/ImagePreview";
import { CameraCapture } from "@/components/plant-diagnosis/CameraCapture";

interface DiagnosisUploadStepProps {
  preview: string | null;
  showTips: boolean;
  setShowTips: (show: boolean) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onAnalyze: () => void;
  loading: boolean;
  locale: "pt" | "en";
}

export const DiagnosisUploadStep: React.FC<DiagnosisUploadStepProps> = ({
  preview,
  showTips,
  setShowTips,
  handleImageUpload,
  onCancel,
  onAnalyze,
  loading,
  locale
}) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleCameraCapture = (imageDataUrl: string) => {
    // Convert data URL to file and trigger the upload handler
    fetch(imageDataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        
        // Create a synthetic event to pass to the upload handler
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        
        const event = {
          target: {
            files: dataTransfer.files
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        
        handleImageUpload(event);
        setShowCamera(false);
      })
      .catch(err => {
        console.error("Error processing camera capture:", err);
      });
  };

  return (
    <>
      {showCamera ? (
        <CameraCapture 
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      ) : (
        <>
          <ImageUploadArea
            captureImage={() => setShowCamera(true)}
            handleImageUpload={handleImageUpload}
            showTips={showTips}
            setShowTips={setShowTips}
          />

          {preview && (
            <ImagePreview
              preview={preview}
              onCancel={onCancel}
              onAnalyze={onAnalyze}
              loading={loading}
            />
          )}
        </>
      )}
    </>
  );
};
