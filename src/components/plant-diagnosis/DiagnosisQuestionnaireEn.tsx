
import React from 'react';
import { DiagnosisQuestions } from "@/services/openai-api";
import { QuestionnaireBase } from "./QuestionnaireBase";

interface DiagnosisQuestionnaireProps {
  imagePreview: string;
  onSubmit: (data: DiagnosisQuestions) => void;
  onCancel: () => void;
}

const DiagnosisQuestionnaireEn: React.FC<DiagnosisQuestionnaireProps> = ({
  imagePreview,
  onSubmit,
  onCancel
}) => {
  return (
    <QuestionnaireBase
      imagePreview={imagePreview}
      onSubmit={onSubmit}
      onCancel={onCancel}
      locale="en"
    />
  );
};

export default DiagnosisQuestionnaireEn;
