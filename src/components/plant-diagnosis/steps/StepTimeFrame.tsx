
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepTimeFrameProps {
  timeFrame: string;
  onChange: (value: string) => void;
  locale?: "pt" | "en";
}

export const StepTimeFrame: React.FC<StepTimeFrameProps> = ({ 
  timeFrame, 
  onChange, 
  locale = "pt" 
}) => {
  const labels = {
    pt: {
      title: "Há quanto tempo surgiram os sintomas?",
      placeholder: "Selecione o período",
      options: {
        "1-3 dias": "1-3 dias",
        "4-7 dias": "4-7 dias",
        "1-2 semanas": "1-2 semanas",
        "2-4 semanas": "2-4 semanas",
        "mais de 1 mes": "Mais de 1 mês"
      }
    },
    en: {
      title: "How long ago did the symptoms appear?",
      placeholder: "Select the time period",
      options: {
        "1-3 dias": "1-3 days",
        "4-7 dias": "4-7 days",
        "1-2 semanas": "1-2 weeks",
        "2-4 semanas": "2-4 weeks",
        "mais de 1 mes": "More than 1 month"
      }
    }
  };

  const { title, placeholder, options } = labels[locale];

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>
      <Select value={timeFrame} onValueChange={onChange}>
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
