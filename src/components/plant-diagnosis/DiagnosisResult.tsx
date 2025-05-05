
import React, { useState } from "react";
import { 
  Calendar, 
  CloudRain, 
  Thermometer,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  Info
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
  const [activeTab, setActiveTab] = useState<string>("treatment");
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  const [showApiResponse, setShowApiResponse] = useState<boolean>(false);

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
          
          {isHealthy ? (
            <Alert className="bg-green-50 border-green-100 mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 text-sm">
                Planta saudável
              </AlertTitle>
              <AlertDescription className="text-sm text-gray-700">
                Nossa IA não detectou doenças nesta planta. Continue com os cuidados adequados.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className={`${isLowConfidence ? 'bg-yellow-50 border-yellow-100' : 'bg-green-50 border-green-100'} mb-3`}>
              {isLowConfidence ? 
                <AlertTriangle className="h-4 w-4 text-yellow-600" /> : 
                <Info className="h-4 w-4 text-green-600" />
              }
              <AlertTitle className={`${isLowConfidence ? 'text-yellow-800' : 'text-green-800'} text-sm`}>
                {isLowConfidence ? 'Diagnóstico parcial' : 'Diagnóstico preciso'}
              </AlertTitle>
              <AlertDescription className="text-sm text-gray-700">
                {isLowConfidence 
                  ? 'Recomendamos tirar outra foto com melhor iluminação para aumentar a precisão.'
                  : 'Nossa IA analisou sua imagem e identificou o problema com alta precisão.'}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="sm:w-2/3 space-y-4">
          {isHealthy ? (
            <div className="bg-green-50 p-4 rounded-md border border-green-100">
              <h3 className="font-semibold text-green-800">Nenhuma doença detectada</h3>
              <p className="text-gray-700 text-sm mt-1">
                Sua planta parece saudável. Continue com as práticas de cuidado recomendadas.
              </p>
            </div>
          ) : (
            <>
              <div>
                <Label className="text-gray-500">Diagnóstico</Label>
                <div className="flex items-center">
                  <p className="text-xl font-semibold text-agro-green-800">
                    {diagnosisResult.disease}
                  </p>
                  <span className={`ml-2 text-sm font-medium ${getConfidenceColor(diagnosisResult.confidence)}`}>
                    ({diagnosisResult.confidence}% de certeza)
                  </span>
                </div>
                <p className="text-sm text-gray-500 italic">
                  {diagnosisResult.scientificName}
                </p>
              </div>
              
              {/* Mostrar todas as doenças retornadas pela API */}
              {diseases.length > 1 && (
                <div className="mt-3">
                  <Label className="text-gray-500 mb-2 block">Outras possíveis doenças:</Label>
                  <div className="space-y-2">
                    {diseases.slice(1, 4).map((disease: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <span>{disease.name?.pt || disease.name?.en}</span>
                        <Badge variant="outline" className={getConfidenceColor(Math.round(disease.probability * 100))}>
                          {Math.round(disease.probability * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
            </>
          )}

          {!feedbackGiven && !isHealthy && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-2">Este diagnóstico está correto?</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 border-green-300 hover:bg-green-50 hover:text-green-700"
                  onClick={() => handleFeedback(true)}
                >
                  <Check className="mr-1 h-4 w-4" /> Sim
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-red-300 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleFeedback(false)}
                >
                  <X className="mr-1 h-4 w-4" /> Não
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      {!isHealthy && (
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
      )}
      
      {/* API Response Debug Section (toggleable) */}
      {apiResponse && (
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => setShowApiResponse(!showApiResponse)} 
            size="sm"
            className="text-xs"
          >
            {showApiResponse ? "Ocultar resposta da API" : "Ver resposta da API"}
          </Button>
          
          {showApiResponse && (
            <div className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200 overflow-auto max-h-60">
              <pre className="text-xs">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      
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
