
import React from "react";
import { DiagnosisQuestions } from "@/services/openai-api";
import { QuestionnaireImagePreview } from "./QuestionnaireImagePreview";
import { QuestionnaireNavigation } from "./QuestionnaireNavigation";
import { LocationDisplay } from "./LocationDisplay";
import { StepCulture } from "./steps/StepCulture";
import { StepAffectedArea } from "./steps/StepAffectedArea";
import { StepSymptoms } from "./steps/StepSymptoms";
import { StepTimeFrame } from "./steps/StepTimeFrame";
import { StepProducts } from "./steps/StepProducts";
import { StepWeather } from "./steps/StepWeather";
import { useQuestionnaireForm } from "@/hooks/use-questionnaire-form";
import { questionnaireTranslations } from "./questionnaireTranslations";

interface QuestionnaireBaseProps {
  imagePreview: string;
  imageFile?: File;
  onSubmit: (data: DiagnosisQuestions) => void;
  onCancel: () => void;
  locale?: "pt" | "en";
}

export const QuestionnaireBase: React.FC<QuestionnaireBaseProps> = ({ 
  imagePreview, 
  imageFile,
  onSubmit, 
  onCancel,
  locale = "pt" 
}) => {
  const {
    step,
    setStep,
    totalSteps,
    formData,
    isLoading,
    locationName,
    locationLoading,
    locationError,
    handleChange,
    handleContinue,
    clearLocation
  } = useQuestionnaireForm({
    imagePreview,
    imageFile,
    onSubmit,
    locale
  });

  const t = questionnaireTranslations[locale];

  // Handle going back one step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  // Check if the continue button should be disabled based on current step
  const isNextButtonDisabled = () => {
    switch (step) {
      case 1: return !formData.culture;
      case 2: return !formData.affectedArea;
      case 3: return !formData.symptoms;
      case 4: return !formData.timeFrame;
      case 5: return !formData.recentProducts;
      default: return false;
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (step) {
      case 1: 
        return (
          <StepCulture 
            culture={formData.culture} 
            onChange={(value) => handleChange("culture", value)}
            locale={locale}
          />
        );
      case 2: 
        return (
          <StepAffectedArea 
            affectedArea={formData.affectedArea} 
            onChange={(value) => handleChange("affectedArea", value)}
            locale={locale}
          />
        );
      case 3: 
        return (
          <StepSymptoms 
            symptoms={formData.symptoms} 
            onChange={(value) => handleChange("symptoms", value)}
            locale={locale}
          />
        );
      case 4: 
        return (
          <StepTimeFrame 
            timeFrame={formData.timeFrame} 
            onChange={(value) => handleChange("timeFrame", value)}
            locale={locale}
          />
        );
      case 5: 
        return (
          <StepProducts 
            recentProducts={formData.recentProducts || ""} 
            onChange={(value) => handleChange("recentProducts", value)}
            locale={locale}
          />
        );
      case 6: 
        return (
          <>
            <StepWeather 
              weatherChanges={formData.weatherChanges || ""} 
              onChange={(value) => handleChange("weatherChanges", value)}
              locale={locale}
            />
            
            {/* Location Information */}
            <LocationDisplay 
              locationName={locationName} 
              isLoading={locationLoading} 
              error={locationError} 
              onClear={clearLocation}
              label={t.location.title}
              loadingMessage={t.location.loading}
              errorMessage={t.location.error}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col space-y-4">
        {/* Image Preview */}
        <QuestionnaireImagePreview 
          imagePreview={imagePreview} 
          altText={t.imageAlt} 
        />
        
        {/* Progress and Navigation */}
        <QuestionnaireNavigation
          currentStep={step}
          totalSteps={totalSteps}
          isLoading={isLoading}
          onCancel={handleBack}
          onContinue={handleContinue}
          isNextDisabled={isNextButtonDisabled()}
          stepLabels={t.stepLabel}
          translations={t}
        />
        
        {/* Current Step Content */}
        {renderStepContent()}
      </div>
    </div>
  );
};
