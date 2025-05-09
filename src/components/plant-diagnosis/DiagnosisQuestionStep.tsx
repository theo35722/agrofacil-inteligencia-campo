
import React from "react";
import { DiagnosisQuestions } from "@/services/openai-api";
import DiagnosisQuestionnaire from "@/components/plant-diagnosis/DiagnosisQuestionnaire";
import DiagnosisQuestionnaireEn from "@/components/plant-diagnosis/DiagnosisQuestionnaireEn";

interface DiagnosisQuestionStepProps {
  imagePreview: string;
  imageFile: File | null;
  onSubmit: (questions: DiagnosisQuestions) => void;
  onCancel: () => void;
  locale: "pt" | "en";
}

export const DiagnosisQuestionStep: React.FC<DiagnosisQuestionStepProps> = ({
  imagePreview,
  imageFile,
  onSubmit,
  onCancel,
  locale
}) => {
  return (
    locale === "pt" ? (
      <DiagnosisQuestionnaire
        imagePreview={imagePreview}
        imageFile={imageFile || undefined}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    ) : (
      <DiagnosisQuestionnaireEn
        imagePreview={imagePreview}
        imageFile={imageFile || undefined}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    )
  );
};
