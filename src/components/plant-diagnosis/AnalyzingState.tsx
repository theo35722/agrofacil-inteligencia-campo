
import React, { useState, useEffect } from "react";
import { MapPin, Info, Database, Zap, CheckCircle, Leaf, Eye } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Progress } from "@/components/ui/progress";

export const AnalyzingState: React.FC = () => {
  const location = useGeolocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Simulate analysis progress with real-like timing
  useEffect(() => {
    const steps = [15, 35, 65, 85, 100];
    const delays = [2000, 4000, 6000, 8000]; // Tempos mais realistas para análise
    
    let timeouts: number[] = [];
    
    steps.forEach((step, index) => {
      if (index === 0) {
        setProgress(step);
        return;
      }
      
      const timeout = setTimeout(() => {
        setProgress(step);
        setCurrentStep(index);
      }, delays[index - 1]);
      
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);
  
  const analysisSteps = [
    { 
      icon: <Eye className="h-4 w-4 mr-1.5 mt-0.5 text-agro-blue-500" />,
      text: "Analisando características visuais da planta",
      detail: "Identificação de textura, cor e padrões específicos"
    },
    { 
      icon: <Leaf className="h-4 w-4 mr-1.5 mt-0.5 text-agro-blue-500" />,
      text: "Processando dados específicos para capim e forragens",
      detail: "Foco em doenças e pragas comuns em pastagens brasileiras"
    },
    { 
      icon: <Database className="h-4 w-4 mr-1.5 mt-0.5 text-agro-blue-500" />,
      text: "Comparação com banco de dados especializado",
      detail: "Base com +5.000 doenças e pragas catalogadas"
    },
    { 
      icon: <Info className="h-4 w-4 mr-1.5 mt-0.5 text-agro-blue-500" />,
      text: "Calculando precisão do diagnóstico",
      detail: "Avaliação da confiança com base em múltiplos fatores"
    },
  ];
  
  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-24 h-24 relative mb-6">
        <div className="w-full h-full border-4 border-agro-green-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-agro-green-600 font-bold">{progress}%</p>
        </div>
      </div>
      
      <p className="text-agro-green-800 font-medium mb-4">Analisando imagem com IA avançada</p>
      
      <div className="w-full max-w-md mb-4">
        <Progress value={progress} className="h-2 bg-gray-100" />
      </div>
      
      <div className="w-full max-w-md bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4">
        <p className="text-gray-700 font-medium text-sm mb-3">
          Processo de análise:
        </p>
        
        <ul className="space-y-3">
          {analysisSteps.map((step, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-0.5">
                {currentStep >= index ? (
                  <CheckCircle className="h-4 w-4 text-agro-green-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  {step.icon}
                  <span className={`text-sm ${currentStep >= index ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                    {step.text}
                  </span>
                </div>
                {currentStep >= index && (
                  <p className="text-xs text-gray-500 mt-0.5 ml-5">{step.detail}</p>
                )}
              </div>
            </li>
          ))}
          
          {!location.error && !location.loading && (
            <li className="flex items-start">
              <div className="mr-2 mt-0.5">
                {currentStep >= 2 ? (
                  <CheckCircle className="h-4 w-4 text-agro-green-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                )}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 mt-0.5 text-agro-blue-500" />
                <span className={`text-sm ${currentStep >= 2 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                  Processando dados de doenças comuns na sua região
                </span>
              </div>
            </li>
          )}
        </ul>
      </div>
      
      <div className="w-full max-w-md bg-agro-green-50 border border-agro-green-100 rounded-lg p-4">
        <p className="text-sm text-agro-green-800 font-medium mb-2">
          Tecnologias em ação:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start text-xs text-gray-600">
            <Zap className="h-3 w-3 mr-1.5 mt-0.5 text-agro-green-600" />
            <span>Inteligência artificial treinada com +50.000 imagens de plantas</span>
          </li>
          <li className="flex items-start text-xs text-gray-600">
            <Database className="h-3 w-3 mr-1.5 mt-0.5 text-agro-green-600" />
            <span>Banco de dados especializado em pastagens e forrageiras brasileiras</span>
          </li>
          {!location.error && !location.loading && (
            <li className="flex items-start text-xs text-gray-600">
              <MapPin className="h-3 w-3 mr-1.5 mt-0.5 text-agro-green-600" />
              <span>
                Análise contextualizada com dados geográficos da sua propriedade
              </span>
            </li>
          )}
        </ul>
      </div>
      
      <div className="flex items-center mt-4 text-gray-500 text-xs">
        {location.loading ? (
          <span>Obtendo sua localização...</span>
        ) : location.error ? (
          <span>Analisando com base no nosso banco de dados global</span>
        ) : (
          <>
            <MapPin className="h-3 w-3 mr-1 text-agro-blue-500" />
            <span>
              Dados de localização incorporados para resultados precisos
            </span>
          </>
        )}
      </div>
    </div>
  );
};
