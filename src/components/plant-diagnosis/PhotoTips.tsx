
import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const photoTips = [
  {
    title: "Iluminação adequada",
    description: "Tire fotos com boa iluminação natural, evitando sombras fortes ou reflexos."
  },
  {
    title: "Foco nos sintomas",
    description: "Capture claramente a área afetada da planta, mostrando os sintomas visíveis."
  },
  {
    title: "Várias perspectivas",
    description: "Tire fotos de diferentes ângulos e distâncias para melhor análise."
  },
  {
    title: "Inclua referências",
    description: "Se possível, inclua uma folha saudável para comparação com a área afetada."
  }
];

export const PhotoTips: React.FC = () => {
  return (
    <Accordion type="single" collapsible defaultValue="tips">
      <AccordionItem value="tips">
        <AccordionTrigger className="text-sm font-medium text-agro-green-700">
          Dicas para melhores resultados
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {photoTips.map((tip, index) => (
              <div 
                key={index}
                className="p-3 bg-gray-50 border border-gray-100 rounded-md"
              >
                <p className="text-sm font-medium text-agro-green-700">{tip.title}</p>
                <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
