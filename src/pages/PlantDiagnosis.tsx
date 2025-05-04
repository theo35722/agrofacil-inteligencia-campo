
import { useState } from "react";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

import { ImagePreview } from "@/components/plant-diagnosis/ImagePreview";
import { ImageUploadArea } from "@/components/plant-diagnosis/ImageUploadArea";
import { AnalyzingState } from "@/components/plant-diagnosis/AnalyzingState";
import { DiagnosisResult } from "@/components/plant-diagnosis/DiagnosisResult";
import { CameraCapture } from "@/components/plant-diagnosis/CameraCapture";
import { ContextDataForm, ContextData } from "@/components/plant-diagnosis/ContextDataForm";
import { DiseaseDiagnosis } from "@/services/plantnet-api";

enum DiagnosisStep {
  Upload,
  Camera,
  ContextData,
  Analyzing,
  Result
}

// Array de resultados simulados para diagnóstico
const mockDiagnosisResults: DiseaseDiagnosis[] = [
  {
    disease: "Ferrugem asiática",
    scientificName: "Phakopsora pachyrhizi",
    confidence: 92,
    severity: "Moderada",
    spreadRisk: "Alto",
    symptoms: [
      "Manchas amareladas nas folhas",
      "Pústulas marrom-avermelhadas na face inferior das folhas",
      "Desfolha prematura em estágios avançados"
    ],
    recommendations: [
      {
        product: "Fungicida Sistêmico",
        activeIngredient: "Azoxistrobina + Ciproconazol",
        dosage: "300-400 mL/ha",
        application: "Foliar",
        interval: "14-21 dias",
        preharvest: "30 dias",
        timing: "Aplicar ao amanhecer ou entardecer",
        weather: "Evitar aplicação em dias chuvosos ou com ventos fortes"
      }
    ],
    preventiveMeasures: [
      "Rotação de culturas com espécies não hospedeiras",
      "Eliminar plantas voluntárias antes do plantio",
      "Utilizar cultivares com genes de resistência",
      "Monitorar regularmente a lavoura para detecção precoce",
      "Respeitar o vazio sanitário"
    ]
  },
  {
    disease: "Mancha alvo",
    scientificName: "Corynespora cassiicola",
    confidence: 87,
    severity: "Leve a moderada",
    spreadRisk: "Médio",
    symptoms: [
      "Lesões circulares com centro escuro e bordas amareladas",
      "Anéis concêntricos nas manchas",
      "Necroses nas nervuras"
    ],
    recommendations: [
      {
        product: "Fungicida Protetor + Sistêmico",
        activeIngredient: "Fluxapiroxade + Piraclostrobina",
        dosage: "250-300 mL/ha",
        application: "Foliar",
        interval: "14 dias",
        preharvest: "28 dias",
        timing: "Aplicação preventiva ou aos primeiros sintomas",
        weather: "Temperatura moderada, sem previsão de chuvas"
      }
    ],
    preventiveMeasures: [
      "Utilizar sementes certificadas e tratadas",
      "Evitar o plantio em áreas com histórico da doença",
      "Adotar manejo adequado de plantas daninhas",
      "Manter nutrição equilibrada da lavoura",
      "Monitoramento constante da cultura"
    ]
  },
  {
    disease: "Deficiência de nitrogênio",
    scientificName: "Deficiência nutricional",
    confidence: 78,
    severity: "Moderada",
    spreadRisk: "Baixo",
    symptoms: [
      "Amarelecimento das folhas mais antigas",
      "Crescimento reduzido da planta",
      "Folhas pequenas e pálidas"
    ],
    recommendations: [
      {
        product: "Fertilizante nitrogenado",
        activeIngredient: "Ureia ou Nitrato de amônio",
        dosage: "100-150 kg/ha",
        application: "Solo ou foliar",
        interval: "Conforme estágio fenológico",
        preharvest: "Não aplicável",
        timing: "Preferencialmente em períodos sem chuvas intensas",
        weather: "Evitar aplicação com solo muito seco ou encharcado"
      }
    ],
    preventiveMeasures: [
      "Análise de solo periódica",
      "Adubação balanceada conforme necessidade da cultura",
      "Uso de cobertura verde em rotação",
      "Manejo adequado de restos culturais",
      "Monitoramento do estado nutricional das plantas"
    ]
  },
  {
    disease: "Planta saudável",
    scientificName: "Status normal",
    confidence: 95,
    severity: "Nenhuma",
    spreadRisk: "Nenhum",
    symptoms: [
      "Sem sintomas de doenças ou deficiências",
      "Desenvolvimento normal",
      "Folhagem com coloração adequada"
    ],
    recommendations: [
      {
        product: "Manutenção preventiva",
        activeIngredient: "Manejo integrado",
        dosage: "Conforme recomendação para a cultura",
        application: "Variada",
        interval: "Conforme calendário agrícola",
        preharvest: "Não aplicável",
        timing: "Seguir calendário agrícola regional",
        weather: "Condições ideais para cada operação"
      }
    ],
    preventiveMeasures: [
      "Continuar monitoramento regular",
      "Seguir práticas de manejo recomendadas",
      "Manter equilíbrio nutricional",
      "Adotar controle preventivo de pragas e doenças",
      "Manter rotação de culturas"
    ]
  }
];

const PlantDiagnosis = () => {
  const [step, setStep] = useState<DiagnosisStep>(DiagnosisStep.Upload);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [contextData, setContextData] = useState<ContextData | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiseaseDiagnosis | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  
  // Monitor online/offline status
  useState(() => {
    const handleOnlineStatusChange = () => {
      setIsOffline(!navigator.onLine);
      if (navigator.onLine) {
        toast.success("Conexão restabelecida", { 
          description: "Sincronizando dados..." 
        });
      } else {
        toast.warning("Modo offline", { 
          description: "Os diagnósticos serão salvos localmente e sincronizados quando houver conexão." 
        });
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  });
  
  // Basic image validation
  const validateImage = (imageDataUrl: string): boolean => {
    // This is a placeholder for actual image validation
    // In a real implementation, you would check brightness, blur, etc.
    
    // For now, we just ensure the image exists
    return !!imageDataUrl;
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Arquivo inválido", { description: "Por favor, selecione uma imagem" });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande", { description: "O tamanho máximo é 10MB" });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        toast.success("Imagem carregada com sucesso");
      };
      reader.readAsDataURL(file);
    }
  };
  
  const openCamera = () => {
    setStep(DiagnosisStep.Camera);
  };
  
  const handleCameraCapture = (imageDataUrl: string) => {
    setImagePreview(imageDataUrl);
    setStep(DiagnosisStep.Upload);
    toast.success("Foto capturada com sucesso");
  };
  
  const closeCameraCapture = () => {
    setStep(DiagnosisStep.Upload);
  };
  
  const continueToContextData = () => {
    if (!imagePreview) {
      toast.error("É necessário enviar uma imagem para diagnóstico");
      return;
    }
    
    if (!validateImage(imagePreview)) {
      toast.error("A imagem não é clara o suficiente", { 
        description: "Por favor, tire uma foto com melhor iluminação e foco na área afetada" 
      });
      return;
    }
    
    setStep(DiagnosisStep.ContextData);
  };
  
  const handleContextDataSubmit = async (data: ContextData) => {
    setContextData(data);
    setStep(DiagnosisStep.Analyzing);
    
    try {
      // Simulação de processamento com tempo de espera variável
      const processingTime = 2000 + Math.random() * 1000;
      
      setTimeout(() => {
        // Escolher um diagnóstico aleatório dos resultados simulados
        const randomIndex = Math.floor(Math.random() * mockDiagnosisResults.length);
        const result = mockDiagnosisResults[randomIndex];
        
        // Ajuste na confiança para dar mais variabilidade
        result.confidence = Math.max(50, Math.min(99, result.confidence + (Math.random() * 10 - 5)));
        
        setDiagnosisResult(result);
        setStep(DiagnosisStep.Result);
        toast.success("Diagnóstico concluído!");
      }, processingTime);
      
    } catch (error) {
      console.error("Erro na análise:", error);
      toast.error("Erro no diagnóstico", {
        description: "Não foi possível completar a análise. Tente novamente."
      });
      setStep(DiagnosisStep.Upload);
    }
  };
  
  const resetDiagnosis = () => {
    setStep(DiagnosisStep.Upload);
    setImagePreview(null);
    setContextData(null);
    setDiagnosisResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
          Diagnóstico de Planta
        </h1>
        <p className="text-gray-600">
          Tire uma foto da sua planta para identificar problemas e obter recomendações detalhadas de tratamento
        </p>
      </div>
      
      {step === DiagnosisStep.Upload && (
        <Alert className="bg-agro-green-50 border-agro-green-100 text-agro-green-800">
          <Info className="h-4 w-4" />
          <AlertTitle>Como tirar a melhor foto para diagnóstico</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Use luz natural, evitando sombras fortes</li>
              <li>Foque diretamente na área afetada da planta</li>
              <li>Inclua folhas saudáveis próximas para comparação</li>
              <li>Evite fundos confusos que possam atrapalhar a análise</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {isOffline && (
        <Alert className="bg-orange-50 border-orange-100">
          <AlertTitle className="text-orange-800">Modo offline ativado</AlertTitle>
          <AlertDescription className="text-orange-700">
            O diagnóstico será salvo localmente e sincronizado automaticamente quando houver conexão.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="agro-card">
        <CardContent className="pt-6">
          {step === DiagnosisStep.Camera && (
            <CameraCapture
              onCapture={handleCameraCapture}
              onClose={closeCameraCapture}
            />
          )}
          
          {step === DiagnosisStep.Upload && (
            <div className="space-y-6">
              {imagePreview ? (
                <ImagePreview 
                  imagePreview={imagePreview} 
                  resetDiagnosis={resetDiagnosis} 
                  startAnalysis={continueToContextData}
                />
              ) : (
                <ImageUploadArea 
                  captureImage={openCamera}
                  handleImageUpload={handleImageUpload}
                />
              )}
            </div>
          )}
          
          {step === DiagnosisStep.ContextData && imagePreview && (
            <ContextDataForm
              imagePreview={imagePreview}
              onSubmit={handleContextDataSubmit}
              onBack={() => setStep(DiagnosisStep.Upload)}
            />
          )}
          
          {step === DiagnosisStep.Analyzing && <AnalyzingState />}
          
          {step === DiagnosisStep.Result && diagnosisResult && imagePreview && (
            <DiagnosisResult 
              imagePreview={imagePreview} 
              diagnosisResult={diagnosisResult}
              resetDiagnosis={resetDiagnosis}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantDiagnosis;
