
import React from 'react';

interface QuestionnaireProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string;
}

export const QuestionnaireProgress: React.FC<QuestionnaireProgressProps> = ({ 
  currentStep, 
  totalSteps,
  stepLabels = "Passo"
}) => {
  return (
    <>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-300" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 text-center">
        {stepLabels} {currentStep} de {totalSteps}
      </p>
    </>
  );
};
