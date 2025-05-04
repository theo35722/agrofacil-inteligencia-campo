
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
  
  // Mock diagnosis result
  const diagnosisResult = {
    disease: "Ferrugem asiática",
    scientificName: "Phakopsora pachyrhizi",
    severity: "Moderada",
    affectedArea: "Folhas",
    spreadRisk: "Alto",
    confidence: 94, // Added confidence score
    recommendations: [
      {
        product: "Fungicida XYZ",
        activeIngredient: "Azoxistrobina + Ciproconazol",
        dosage: "500ml/ha",
        application: "Pulverização foliar",
        timing: "Aplicar nas primeiras horas da manhã ou final da tarde",
        interval: "Reaplicar após 14-21 dias",
        weather: "Evitar aplicação com previsão de chuva nas próximas 4 horas",
        preharvest: "30 dias de carência"
      },
      {
        product: "Fungicida ABC",
        activeIngredient: "Trifloxistrobina + Protioconazol",
        dosage: "400ml/ha",
        application: "Pulverização foliar",
        timing: "Aplicar preferencialmente em dias com baixa umidade",
        interval: "Reaplicar após 14-21 dias",
        weather: "Evitar aplicação em condições de vento forte",
        preharvest: "30 dias de carência"
      }
    ],
    preventiveMeasures: [
      "Rotação de culturas com espécies não hospedeiras",
      "Eliminação de plantas voluntárias",
      "Monitoramento constante da lavoura",
      "Plantio de variedades resistentes quando disponíveis"
    ],
    symptoms: [
      "Pequenos pontos amarelados nas folhas",
      "Lesões que evoluem para pústulas de coloração marrom",
      "Amarelecimento e queda prematura das folhas",
      "Redução do tamanho e peso dos grãos"
    ]
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
  
  // Basic image validation
  const validateImage = (imageDataUrl: string): boolean => {
    // This is a placeholder for actual image validation
    // In a real implementation, you would check brightness, blur, etc.
    
    // For now, we just ensure the image exists
    return !!imageDataUrl;
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
  
  const handleContextDataSubmit = (data: ContextData) => {
    setContextData(data);
    setStep(DiagnosisStep.Analyzing);
    
    // Log the collected context data
    console.log("Plant type:", data.plantType);
    console.log("Symptoms described:", data.symptoms);
    console.log("Location data:", data.locationData);
    
    // Simulate analysis time (would be replaced by actual AI processing)
    setTimeout(() => {
      setStep(DiagnosisStep.Result);
      toast.success("Diagnóstico concluído!");
    }, 2000);
  };
  
  const resetDiagnosis = () => {
    setStep(DiagnosisStep.Upload);
    setImagePreview(null);
    setContextData(null);
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
          <AlertTitle>Como funciona o diagnóstico?</AlertTitle>
          <AlertDescription>
            Nossa tecnologia de IA analisa imagens de plantas para identificar doenças, pragas e deficiências
            nutricionais com alta precisão, fornecendo recomendações personalizadas para tratamento.
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
          
          {step === DiagnosisStep.Result && (
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
