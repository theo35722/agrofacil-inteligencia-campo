
import { DiagnosisQuestions } from "@/services/openai-api";

export interface UseQuestionnaireFormProps {
  onSubmit: (data: DiagnosisQuestions) => void;
  imagePreview: string;
  imageFile?: File;
  locale?: "pt" | "en";
}

export interface UseQuestionnaireFormReturn {
  step: number;
  setStep: (step: number) => void;
  totalSteps: number;
  formData: DiagnosisQuestions;
  isLoading: boolean;
  locationName: string | null;
  locationLoading: boolean;
  locationError: Error | null | string; // Updated to allow string type
  handleChange: (field: keyof DiagnosisQuestions, value: string) => void;
  handleContinue: () => void;
  clearLocation: () => void;
  handleSubmit: () => Promise<void>;
}
