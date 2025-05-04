
import React, { useState } from "react";
import { 
  Calendar, 
  CloudRain, 
  Thermometer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RecommendationProps {
  product: string;
  activeIngredient: string;
  dosage: string;
  application: string;
  timing: string;
  interval: string;
  weather: string;
  preharvest: string;
}

interface DiagnosisResultProps {
  imagePreview: string | null;
  diagnosisResult: {
    disease: string;
    scientificName: string;
    severity: string;
    affectedArea: string;
    spreadRisk: string;
    recommendations: RecommendationProps[];
    preventiveMeasures: string[];
    symptoms: string[];
  };
  resetDiagnosis: () => void;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ 
  imagePreview, 
  diagnosisResult, 
  resetDiagnosis 
}) => {
  const [activeTab, setActiveTab] = useState<string>("treatment");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:w-1/3">
          <div className="rounded-lg overflow-hidden border border-agro-green-200 mb-4">
            <img 
              src={imagePreview || ''} 
              alt="Imagem analisada" 
              className="w-full object-cover"
            />
          </div>
          
          <Alert className="bg-green-50 border-green-100 mb-3">
            <AlertTitle className="text-green-800 text-sm">Diagnóstico preciso</AlertTitle>
            <AlertDescription className="text-sm text-gray-700">
              Nosso sistema de IA analisou sua imagem e identificou o problema com alta precisão.
            </AlertDescription>
          </Alert>
        </div>
        
        <div className="sm:w-2/3 space-y-4">
          <div>
            <Label className="text-gray-500">Diagnóstico</Label>
            <p className="text-xl font-semibold text-agro-green-800">
              {diagnosisResult.disease}
            </p>
            <p className="text-sm text-gray-500 italic">
              {diagnosisResult.scientificName}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-500">Severidade</Label>
              <p className="font-medium text-orange-600">
                {diagnosisResult.severity}
              </p>
            </div>
            <div>
              <Label className="text-gray-500">Risco de disseminação</Label>
              <p className="font-medium text-red-600">
                {diagnosisResult.spreadRisk}
              </p>
            </div>
          </div>
          
          <Accordion type="single" collapsible defaultValue="symptoms">
            <AccordionItem value="symptoms">
              <AccordionTrigger className="text-sm font-medium text-agro-green-700 py-2">
                Sintomas identificados
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 pl-2">
                  {diagnosisResult.symptoms.map((symptom, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="text-agro-green-700 mr-2">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      <Separator />
      
      <Tabs 
        defaultValue="treatment" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="treatment">Tratamento</TabsTrigger>
          <TabsTrigger value="application">Aplicação</TabsTrigger>
          <TabsTrigger value="prevention">Prevenção</TabsTrigger>
        </TabsList>
        
        <TabsContent value="treatment" className="space-y-4">
          <h3 className="font-semibold text-agro-green-700 mb-3">Produtos Recomendados</h3>
          
          {diagnosisResult.recommendations.map((rec, index) => (
            <div 
              key={index}
              className="p-4 bg-agro-green-50 border border-agro-green-200 rounded-md mb-3"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-agro-green-800 text-lg">{rec.product}</p>
                  <p className="text-sm text-gray-600">{rec.activeIngredient}</p>
                </div>
                <span className="bg-agro-green-100 text-agro-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  Recomendado
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dosagem:</p>
                  <p className="text-sm">{rec.dosage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Aplicação:</p>
                  <p className="text-sm">{rec.application}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Intervalo:</p>
                  <p className="text-sm">{rec.interval}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Carência:</p>
                  <p className="text-sm">{rec.preharvest}</p>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="application" className="space-y-4">
          <h3 className="font-semibold text-agro-green-700 mb-3">Instruções de Aplicação</h3>
          
          <div className="space-y-4">
            {diagnosisResult.recommendations.map((rec, index) => (
              <div 
                key={index}
                className="p-4 bg-agro-green-50 border border-agro-green-200 rounded-md"
              >
                <h4 className="font-medium text-agro-green-800 mb-3">{rec.product}</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-agro-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Melhor horário</p>
                      <p className="text-sm text-gray-600">{rec.timing}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CloudRain className="h-5 w-5 text-agro-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Condições climáticas</p>
                      <p className="text-sm text-gray-600">{rec.weather}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Thermometer className="h-5 w-5 text-agro-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Temperatura ideal</p>
                      <p className="text-sm text-gray-600">Entre 18°C e 28°C, sem ventos fortes</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-4 bg-green-50 border border-green-100 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">Equipamentos de proteção</h4>
              <p className="text-sm text-gray-700">
                Sempre utilize equipamentos de proteção individual (EPIs) durante a aplicação: 
                luvas, máscara, óculos de proteção, macacão e botas.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="prevention" className="space-y-4">
          <h3 className="font-semibold text-agro-green-700 mb-3">Medidas Preventivas</h3>
          
          <div className="space-y-3">
            {diagnosisResult.preventiveMeasures.map((measure, index) => (
              <div 
                key={index}
                className="p-3 bg-agro-green-50 border border-agro-green-200 rounded-md"
              >
                <p className="text-agro-green-800">• {measure}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="pt-4">
        <Button 
          className="w-full bg-agro-green-500 hover:bg-agro-green-600"
          onClick={resetDiagnosis}
        >
          Novo Diagnóstico
        </Button>
      </div>
    </div>
  );
};
