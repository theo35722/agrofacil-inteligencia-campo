
import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Leaf } from "lucide-react";

export const photoTips = [
  {
    title: "Iluminação adequada",
    description: "Tire fotos com luz natural, evitando sombras ou reflexos."
  },
  {
    title: "Foco nos sintomas",
    description: "Capture claramente a área afetada da planta."
  },
  {
    title: "Várias perspectivas",
    description: "Tire fotos de diferentes ângulos para melhor análise."
  },
  {
    title: "Inclua folhas saudáveis",
    description: "Ajuda na comparação e melhora o diagnóstico.",
    icon: <Leaf className="h-4 w-4 text-agro-green-600" />
  }
];

export const PhotoTips: React.FC = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="tips" className="border-none">
        <AccordionTrigger className="py-2 text-sm font-medium text-agro-green-700 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Dicas para melhores resultados
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {photoTips.map((tip, index) => (
              <div 
                key={index}
                className="p-3 bg-gray-50 border border-gray-100 rounded-md"
              >
                <div className="flex items-center">
                  {tip.icon ? tip.icon : null}
                  <p className={`text-sm font-medium text-agro-green-700 ${tip.icon ? 'ml-2' : ''}`}>
                    {tip.title}
                  </p>
                </div>
                <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
