
import { QuestionnaireBase } from "./QuestionnaireBase";
import { DiagnosisQuestions } from "@/services/openai-api";

interface DiagnosisQuestionnaireProps {
  imagePreview: string;
  imageFile?: File;
  onSubmit: (data: DiagnosisQuestions) => void;
  onCancel: () => void;
}

const DiagnosisQuestionnaire: React.FC<DiagnosisQuestionnaireProps> = ({ 
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
      locale="pt"
    />
  );
};

export default DiagnosisQuestionnaire;
