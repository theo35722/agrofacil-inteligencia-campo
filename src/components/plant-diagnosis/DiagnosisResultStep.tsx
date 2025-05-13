
import React from "react";
import { DiagnosisResult } from "@/services/openai-api";
import ResultCard from "@/components/plant-diagnosis/ResultCard";
import ResultCardEn from "@/components/plant-diagnosis/ResultCardEn";

interface DiagnosisResultStepProps {
  resultado: DiagnosisResult;
  onNewAnalysis: () => void;
  locale?: "pt" | "en";
}

export const DiagnosisResultStep: React.FC<DiagnosisResultStepProps> = ({
  resultado,
  onNewAnalysis,
  locale = "pt"
}) => {
  return (
    <div className="mt-6 animate-fade-in">
      {locale === "en" ? (
        <ResultCardEn 
          result={resultado} 
          onNewAnalysis={onNewAnalysis}
        />
      ) : (
        <ResultCard 
          result={resultado} 
          onNewAnalysis={onNewAnalysis}
        />
      )}
    </div>
  );
};
