
import React, { useState } from "react";
import { 
  Calendar, 
  CloudRain, 
  Thermometer,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  Share2,
  ChevronDown
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
import { toast } from "sonner";
import { DiseaseDiagnosis } from "@/services/plantnet-api";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface DiagnosisResultProps {
  imagePreview: string;
  diagnosisResult: DiseaseDiagnosis;
  apiResponse?: any;
  resetDiagnosis: () => void;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ 
  imagePreview, 
  diagnosisResult, 
  apiResponse,
  resetDiagnosis 
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("treatment");
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  const [showApiResponse, setShowApiResponse] = useState<boolean>(false);
  const [showFullDetails, setShowFullDetails] = useState<boolean>(!isMobile);

  // Function to handle user feedback about diagnosis accuracy
  const handleFeedback = (isCorrect: boolean) => {
    if (feedbackGiven) return;
    
    setFeedbackGiven(true);
    
    if (isCorrect) {
      toast.success("Obrigado pelo feedback!", { 
        description: "Seu feedback nos ajuda a melhorar nosso sistema de diagnóstico." 
      });
    } else {
      toast.success("Obrigado pelo feedback!", { 
        description: "Usaremos essa informação para melhorar nosso sistema." 
      });
    }
  };

  // Function to get confidence level color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 70) return "text-green-500";
    if (confidence >= 50) return "text-yellow-600";
    return "text-orange-600";
  };

  const isHealthy = 
    apiResponse?.health_assessment?.is_healthy === true || 
    diagnosisResult.disease === "Planta Saudável";
    
  const isLowConfidence = diagnosisResult.confidence < 70;

  // Get all diseases from the API response if available
  const diseases = apiResponse?.health_assessment?.diseases || [];

  return (
    <div className="space-y-5">
      {/* Imagem e Status Principal */}
      <div className="rounded-lg overflow-hidden border border-agro-green-200 shadow-md mb-4 relative">
        <img 
          src={imagePreview || ''} 
          alt="Imagem analisada" 
          className="w-full object-cover max-h-60"
        />
        {isHealthy ? (
          <div className="absolute bottom-0 left-0 right-0 bg-green-500/90 text-white p-2 px-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span className="font-medium">Planta saudável</span>
            </div>
          </div>
        ) : (
          <div className={`absolute bottom-0 left-0 right-0 ${isLowConfidence ? 'bg-yellow-500/90' : 'bg-red-500/90'} text-white p-2 px-4`}>
            <div className="flex items-center">
              {isLowConfidence ? 
                <AlertTriangle className="h-5 w-5 mr-2" /> : 
                <AlertTriangle className="h-5 w-5 mr-2" />
              }
              <span className="font-medium">{isLowConfidence ? 'Possível problema' : 'Problema detectado'}</span>
            </div>
          </div>
        )}
      </div>
  
      {/* Diagnóstico principal - visível para todos */}
      <div className={`p-4 rounded-lg ${isHealthy ? 'bg-green-50 border border-green-100' : 'bg-white border border-gray-200 shadow-sm'}`}>
        {isHealthy ? (
          <div className="text-center py-2">
            <CheckCircle2 className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <h3 className="font-semibold text-green-800 text-lg">Sua planta está saudável!</h3>
            <p className="text-gray-600 text-sm mt-1">Continue com os cuidados recomendados.</p>
          </div>
        ) : (
          <>
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {diagnosisResult.disease}
                  </h3>
                  <p className="text-sm text-gray-500 italic">
                    {diagnosisResult.scientificName || ""}
                  </p>
                </div>
                <Badge className={`${getConfidenceColor(diagnosisResult.confidence)} bg-opacity-10 text-xs`}>
                  {diagnosisResult.confidence}% certeza
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3 mb-2">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Severidade</p>
                <p className="font-medium text-orange-600 text-sm">
                  {diagnosisResult.severity}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Risco de disseminação</p>
                <p className="font-medium text-red-600 text-sm">
                  {diagnosisResult.spreadRisk}
                </p>
              </div>
            </div>
            
            {!feedbackGiven && (
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500">Este diagnóstico está correto?</span>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7 px-2 py-0 text-xs border-green-300"
                    onClick={() => handleFeedback(true)}
                  >
                    <Check className="h-3 w-3 mr-1" /> Sim
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2 py-0 text-xs border-red-300"
                    onClick={() => handleFeedback(false)}
                  >
                    <X className="h-3 w-3 mr-1" /> Não
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Botão de mostrar detalhes completos (mobile) */}
        {isMobile && !isHealthy && (
          <Button
            variant="ghost"
            className="w-full mt-3 text-sm text-agro-green-700"
            onClick={() => setShowFullDetails(!showFullDetails)}
          >
            {showFullDetails ? "Ocultar detalhes" : "Mostrar detalhes completos"}
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showFullDetails ? 'rotate-180' : ''}`} />
          </Button>
        )}
      </div>
      
      {/* Detalhes Completos - condicionalmente exibidos */}
      {(!isMobile || showFullDetails) && !isHealthy && (
        <>
          <Separator />
          
          {/* Outras possíveis doenças */}
          {diseases.length > 1 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Outras possíveis doenças:</h4>
              <div className="space-y-2">
                {diseases.slice(1, 3).map((disease: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm">{disease.name?.pt || disease.name?.en}</span>
                    <Badge variant="outline" className={`${getConfidenceColor(Math.round(disease.probability * 100))} text-xs`}>
                      {Math.round(disease.probability * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sintomas */}
          <Accordion type="single" collapsible defaultValue="symptoms" className="border-none">
            <AccordionItem value="symptoms" className="border-none">
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

          {/* Tratamento e Prevenção */}
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
              {diagnosisResult.recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className="p-3 bg-agro-green-50 border border-agro-green-200 rounded-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-agro-green-800">{rec.product}</p>
                      <p className="text-xs text-gray-600">{rec.activeIngredient}</p>
                    </div>
                    <span className="bg-agro-green-100 text-agro-green-800 text-xs px-2 py-1 rounded-full">
                      Recomendado
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3 text-xs">
                    <div>
                      <p className="font-medium text-gray-600">Dosagem:</p>
                      <p>{rec.dosage}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Aplicação:</p>
                      <p>{rec.application}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Intervalo:</p>
                      <p>{rec.interval}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Carência:</p>
                      <p>{rec.preharvest}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="application" className="space-y-4">
              {diagnosisResult.recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className="p-3 bg-agro-green-50 border border-agro-green-200 rounded-md"
                >
                  <h4 className="font-medium text-agro-green-800 mb-2 text-sm">{rec.product}</h4>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 text-agro-green-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Melhor horário</p>
                        <p className="text-gray-600">{rec.timing}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CloudRain className="h-4 w-4 text-agro-green-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Condições climáticas</p>
                        <p className="text-gray-600">{rec.weather}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Thermometer className="h-4 w-4 text-agro-green-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-700">Temperatura ideal</p>
                        <p className="text-gray-600">Entre 18°C e 28°C</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-3 bg-green-50 border border-green-100 rounded-md text-xs">
                <h4 className="font-medium text-green-800 mb-1">Equipamentos de proteção</h4>
                <p className="text-gray-700">
                  Utilize EPIs: luvas, máscara, óculos de proteção, macacão e botas.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="prevention" className="space-y-2">
              <div className="space-y-2">
                {diagnosisResult.preventiveMeasures.map((measure, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-agro-green-50 border border-agro-green-200 rounded-md"
                  >
                    <p className="text-agro-green-800 text-sm">• {measure}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    
      {/* Botão de novo diagnóstico */}
      <div className="pt-4">
        <Button 
          className="w-full bg-agro-green-500 hover:bg-agro-green-600 py-6 font-medium text-white"
          onClick={resetDiagnosis}
        >
          Novo Diagnóstico
        </Button>
      </div>
    </div>
  );
};
