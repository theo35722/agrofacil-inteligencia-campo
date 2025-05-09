
import React from "react";
import ImageUploadArea from "@/components/plant-diagnosis/ImageUploadArea";
import ImagePreview from "@/components/plant-diagnosis/ImagePreview";

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
  return (
    <>
      <ImageUploadArea
        captureImage={() => document.getElementById("fileInput")?.click()}
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
  );
};
