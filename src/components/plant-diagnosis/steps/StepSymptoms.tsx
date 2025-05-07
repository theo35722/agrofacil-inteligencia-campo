
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StepSymptomsProps {
  symptoms: string;
  onChange: (value: string) => void;
  locale?: "pt" | "en";
}

export const StepSymptoms: React.FC<StepSymptomsProps> = ({ 
  symptoms, 
  onChange, 
  locale = "pt" 
}) => {
  const labels = {
    pt: {
      title: "Quais sintomas você observa?",
      placeholder: "Ex: manchas amarelas, folhas secas, murchamento..."
    },
    en: {
      title: "What symptoms do you observe?",
      placeholder: "Ex: yellow spots, dry leaves, wilting..."
    }
  };

  const { title, placeholder } = labels[locale];

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>
      <Textarea
        value={symptoms}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px] text-base p-3"
      />
    </div>
  );
};
