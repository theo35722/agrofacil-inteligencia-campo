
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepProductsProps {
  recentProducts: string;
  onChange: (value: string) => void;
  locale?: "pt" | "en";
}

export const StepProducts: React.FC<StepProductsProps> = ({ 
  recentProducts, 
  onChange, 
  locale = "pt" 
}) => {
  const labels = {
    pt: {
      title: "Aplicou algum produto recentemente?",
      placeholder: "Selecione uma opção",
      options: {
        "Não": "Não",
        "Sim, herbicida": "Sim, herbicida",
        "Sim, inseticida": "Sim, inseticida",
        "Sim, fungicida": "Sim, fungicida",
        "Sim, fertilizante": "Sim, fertilizante",
        "Sim, outro": "Sim, outro produto"
      }
    },
    en: {
      title: "Have you applied any products recently?",
      placeholder: "Select an option",
      options: {
        "No": "No",
        "Yes, herbicide": "Yes, herbicide",
        "Yes, insecticide": "Yes, insecticide",
        "Yes, fungicide": "Yes, fungicide",
        "Yes, fertilizer": "Yes, fertilizer",
        "Yes, other": "Yes, other product"
      }
    }
  };

  const { title, placeholder, options } = labels[locale];

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>
      <Select value={recentProducts} onValueChange={onChange}>
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
