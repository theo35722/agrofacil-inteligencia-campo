
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepAffectedAreaProps {
  affectedArea: string;
  onChange: (value: string) => void;
  locale?: "pt" | "en";
}

export const StepAffectedArea: React.FC<StepAffectedAreaProps> = ({ 
  affectedArea, 
  onChange, 
  locale = "pt" 
}) => {
  const labels = {
    pt: {
      title: "Qual parte da planta está afetada?",
      placeholder: "Selecione a área afetada",
      options: {
        folhas: "Folhas",
        caule: "Caule/Tronco",
        raiz: "Raiz",
        frutos: "Frutos",
        flores: "Flores",
        planta_toda: "Planta toda"
      }
    },
    en: {
      title: "Which plant part is affected?",
      placeholder: "Select the affected area",
      options: {
        folhas: "Leaves",
        caule: "Stem/Trunk",
        raiz: "Root",
        frutos: "Fruits",
        flores: "Flowers",
        planta_toda: "Whole plant"
      }
    }
  };

  const { title, placeholder, options } = labels[locale];

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>
      <Select value={affectedArea} onValueChange={onChange}>
        <SelectTrigger className="w-full p-3 h-auto text-base">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(options).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
