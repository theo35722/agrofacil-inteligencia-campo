
import React from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle, ArrowRight } from "lucide-react";
import { QuestionnaireProgress } from "./QuestionnaireProgress";

interface QuestionnaireNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onCancel: () => void;
  onContinue: () => void;
  isNextDisabled: boolean;
  stepLabels?: string;
  translations: {
    buttons: {
      cancel: string;
      back: string;
      next: string;
      analyze: string;
      analyzing: string;
    };
  };
}

export const QuestionnaireNavigation: React.FC<QuestionnaireNavigationProps> = ({
  currentStep,
  totalSteps,
  isLoading,
  onCancel,
  onContinue,
  isNextDisabled,
  stepLabels = "Step",
  translations
}) => {
  const { buttons } = translations;
  
  return (
    <>
      {/* Progress Indicator */}
      <QuestionnaireProgress 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        stepLabels={stepLabels}
      />
      
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={currentStep === 1 ? onCancel : () => currentStep > 1 && onCancel}
        >
          {currentStep === 1 ? buttons.cancel : buttons.back}
        </Button>
        
        <Button 
          onClick={onContinue}
          disabled={isLoading || isNextDisabled}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {buttons.analyzing}
            </>
          ) : currentStep === totalSteps ? (
            buttons.analyze
          ) : (
            <>
              {buttons.next}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </>
  );
};
