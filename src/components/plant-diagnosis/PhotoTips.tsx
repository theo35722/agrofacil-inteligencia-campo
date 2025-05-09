
import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Leaf, Info, Camera } from "lucide-react";

export const photoTips = [
  {
    title: "Iluminação adequada",
    description: "Tire fotos com luz natural, evitando sombras ou reflexos.",
    icon: <Camera className="h-4 w-4 text-agro-green-600" />
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
    <div className="mb-4">
      <div className="bg-agro-green-50 border border-agro-green-100 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Info className="h-5 w-5 mr-2 text-agro-green-700" />
          <h3 className="text-md font-medium text-agro-green-800">
            Dicas para melhores resultados
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {photoTips.map((tip, index) => (
            <div 
              key={index}
              className="p-3 bg-white border border-gray-100 rounded-md shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                {tip.icon ? tip.icon : <Camera className="h-4 w-4 text-agro-green-600" />}
                <p className="ml-2 text-sm font-medium text-agro-green-700">
                  {tip.title}
                </p>
              </div>
              <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
            </div>
          ))}
        </div>
        
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem value="details" className="border-t border-agro-green-100">
            <AccordionTrigger className="py-2 text-sm font-medium text-agro-green-700">
              Mais detalhes
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-gray-600">
                A qualidade da foto é crucial para um diagnóstico preciso. Certifique-se de que a imagem está nítida, 
                com boa iluminação e que mostra claramente os sintomas da planta. Evite sombras fortes e reflexos que possam 
                mascarar os sintomas.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
