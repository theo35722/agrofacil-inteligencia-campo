
import React from "react";

interface DiagnosisHeaderProps {
  locale: "pt" | "en";
}

export const DiagnosisHeader: React.FC<DiagnosisHeaderProps> = ({ locale }) => {
  return (
    <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 text-center">
      {locale === "pt" ? "Diagnóstico de Planta" : "Plant Diagnosis"}
    </h1>
  );
};
