
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepWeatherProps {
  weatherChanges: string;
  onChange: (value: string) => void;
  locale?: "pt" | "en";
}

export const StepWeather: React.FC<StepWeatherProps> = ({ 
  weatherChanges, 
  onChange, 
  locale = "pt" 
}) => {
  const labels = {
    pt: {
      title: "Houve alguma mudança recente no clima?",
      placeholder: "Selecione a condição climática",
      options: {
        "Sem mudanças": "Sem mudanças significativas",
        "Muita chuva": "Muita chuva",
        "Seca prolongada": "Seca prolongada",
        "Geada": "Geada",
        "Calor extremo": "Calor extremo",
        "Vento forte": "Vento forte",
        "Granizo": "Granizo"
      }
    },
    en: {
      title: "Any recent weather changes?",
      placeholder: "Select weather condition",
      options: {
        "No changes": "No significant changes",
        "Heavy rain": "Heavy rain",
        "Prolonged drought": "Prolonged drought",
        "Frost": "Frost",
        "Extreme heat": "Extreme heat",
        "Strong wind": "Strong wind",
        "Hail": "Hail"
      }
    }
  };

  const { title, placeholder, options } = labels[locale];

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>
      <Select value={weatherChanges} onValueChange={onChange}>
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
