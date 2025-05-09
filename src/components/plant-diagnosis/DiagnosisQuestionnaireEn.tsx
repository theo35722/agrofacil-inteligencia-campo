
import { QuestionnaireBase } from "./QuestionnaireBase";
import { DiagnosisQuestions } from "@/services/openai-api";

interface DiagnosisQuestionnaireEnProps {
  imagePreview: string;
  imageFile?: File;
  onSubmit: (data: DiagnosisQuestions) => void;
  onCancel: () => void;
}

const DiagnosisQuestionnaireEn: React.FC<DiagnosisQuestionnaireEnProps> = ({ 
  imagePreview,
  imageFile,
  onSubmit, 
  onCancel 
}) => {
  return (
    <QuestionnaireBase 
      imagePreview={imagePreview}
      imageFile={imageFile}
      onSubmit={onSubmit}
      onCancel={onCancel}
      locale="en"
    />
  );
};

export default DiagnosisQuestionnaireEn;
