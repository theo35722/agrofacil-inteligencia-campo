
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepCultureProps {
  culture: string;
  onChange: (value: string) => void;
  locale?: "pt" | "en";
}

export const StepCulture: React.FC<StepCultureProps> = ({ 
  culture, 
  onChange, 
  locale = "pt" 
}) => {
  const labels = {
    pt: {
      title: "Qual é a cultura?",
      placeholder: "Selecione a cultura",
      options: {
        milho: "Milho", 
        soja: "Soja",
        tomate: "Tomate",
        algodao: "Algodão",
        cafe: "Café",
        trigo: "Trigo",
        feijao: "Feijão",
        arroz: "Arroz",
        citros: "Cítros (Laranja, Limão)",
        outro: "Outro"
      }
    },
    en: {
      title: "What crop is this?",
      placeholder: "Select the crop",
      options: {
        milho: "Corn", 
        soja: "Soybean",
        tomate: "Tomato",
        algodao: "Cotton",
        cafe: "Coffee",
        trigo: "Wheat",
        feijao: "Beans",
        arroz: "Rice",
        citros: "Citrus (Orange, Lemon)",
        outro: "Other"
      }
    }
  };

  const { title, placeholder, options } = labels[locale];

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>
      <Select value={culture} onValueChange={onChange}>
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
