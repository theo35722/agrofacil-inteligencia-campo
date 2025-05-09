
import React from "react";
import { DiagnosisResult } from "@/services/openai-api";
import ResultCard from "@/components/plant-diagnosis/ResultCard";

interface DiagnosisResultStepProps {
  resultado: DiagnosisResult;
  onNewAnalysis: () => void;
}

export const DiagnosisResultStep: React.FC<DiagnosisResultStepProps> = ({
  resultado,
  onNewAnalysis
}) => {
  return (
    <div className="mt-6 animate-fade-in">
      <ResultCard 
        result={resultado} 
        onNewAnalysis={onNewAnalysis}
      />
    </div>
  );
};
