
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
import { analyzePlantImage, DiseaseDiagnosis } from "@/services/plantnet-api";

enum DiagnosisStep {
  Upload,
  Camera,
  ContextData,
  Analyzing,
  Result
}

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
      // Process using PlantNet API service
      if (imagePreview) {
        const result = await analyzePlantImage(imagePreview, data);
        setDiagnosisResult(result);
        setStep(DiagnosisStep.Result);
        toast.success("Diagnóstico concluído!");
      } else {
        throw new Error("Imagem não disponível");
      }
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
