
import { DiagnosisHeader } from "./DiagnosisHeader";
import { DiagnosisUploadStep } from "./DiagnosisUploadStep";
import { DiagnosisQuestionStep } from "./DiagnosisQuestionStep";
import { DiagnosisResultStep } from "./DiagnosisResultStep";
import { AnalyzingState } from "@/components/plant-diagnosis/AnalyzingState";
import { ApiKeyValidator } from "@/components/plant-diagnosis/ApiKeyValidator";
import { useDiagnosisState } from "@/hooks/use-diagnosis-state";

export enum DiagnosisStep {
  UPLOAD,
  QUESTIONS,
  ANALYZING,
  RESULT
}

interface DiagnosisContainerProps {
  locale: "pt" | "en";
}

export const DiagnosisContainer: React.FC<DiagnosisContainerProps> = ({ locale }) => {
  const { 
    image,
    preview,
    loading,
    resultado,
    showTips,
    currentStep,
    isUsingFallback,
    showKeyValidator,
    setShowTips,
    setShowKeyValidator,
    handleApiValidation,
    handleImageUpload,
    handleQuestionsSubmit,
    resetAnalysis,
    cancelQuestions
  } = useDiagnosisState(locale);

  return (
    <div className="min-h-screen px-4 py-6 md:px-12 md:py-10 bg-gradient-to-br from-green-50 to-white">
      <DiagnosisHeader locale={locale} />

      {/* API Key Validator - hidden by default */}
      {showKeyValidator && (
        <ApiKeyValidator onValidationComplete={handleApiValidation} />
      )}

      {currentStep === DiagnosisStep.UPLOAD && (
        <DiagnosisUploadStep 
          preview={preview}
          showTips={showTips}
          setShowTips={setShowTips}
          handleImageUpload={handleImageUpload}
          onCancel={() => {
            resetAnalysis();
          }}
          onAnalyze={() => currentStep === DiagnosisStep.UPLOAD && preview && handleQuestionsSubmit}
          loading={loading}
          locale={locale}
        />
      )}

      {currentStep === DiagnosisStep.QUESTIONS && preview && (
        <DiagnosisQuestionStep
          imagePreview={preview}
          imageFile={image}
          onSubmit={handleQuestionsSubmit}
          onCancel={cancelQuestions}
          locale={locale}
        />
      )}
      
      {currentStep === DiagnosisStep.ANALYZING && (
        <AnalyzingState isUsingFallback={isUsingFallback} />
      )}

      {currentStep === DiagnosisStep.RESULT && resultado && (
        <DiagnosisResultStep
          resultado={resultado}
          onNewAnalysis={resetAnalysis}
        />
      )}

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
};
