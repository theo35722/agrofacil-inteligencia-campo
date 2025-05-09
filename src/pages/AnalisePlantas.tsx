import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { DiagnosisQuestions, DiagnosisResult, analyzePlantWithAI } from "@/services/openai-api";
import ImageUploadArea from "@/components/plant-diagnosis/ImageUploadArea";
import ImagePreview from "@/components/plant-diagnosis/ImagePreview";
import ResultCard from "@/components/plant-diagnosis/ResultCard";
import DiagnosisQuestionnaire from "@/components/plant-diagnosis/DiagnosisQuestionnaire";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnalyzingState } from "@/components/plant-diagnosis/AnalyzingState";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ApiKeyValidator } from "@/components/plant-diagnosis/ApiKeyValidator";

enum DiagnosisStep {
  UPLOAD,
  QUESTIONS,
  ANALYZING,
  RESULT
}

export default function AnalisePlantas() {
  const isMobile = useIsMobile();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<DiagnosisResult | null>(null);
  const [showTips, setShowTips] = useState(true); // Dicas visíveis por padrão
  const [currentStep, setCurrentStep] = useState<DiagnosisStep>(DiagnosisStep.UPLOAD);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  const [showKeyValidator, setShowKeyValidator] = useState(false); // Escondemos o validador por padrão

  useEffect(() => {
    // Check if API key is configured
    const hasApiKey = !!import.meta.env.VITE_OPENAI_API_KEY;
    setApiKeyConfigured(hasApiKey);
    
    if (!hasApiKey) {
      toast.warning("Chave da API OpenAI não configurada. O app usará o modo fallback.", {
        duration: 5000,
      });
    }
  }, []);

  const handleApiValidation = (isValid: boolean) => {
    console.log("API Key válida:", isValid);
    setApiKeyConfigured(isValid);
    
    if (!isValid) {
      toast.warning("Problemas com a chave da API OpenAI. O app usará o modo fallback.", {
        duration: 5000,
      });
    } else {
      toast.success("Chave da API OpenAI validada com sucesso!", {
        duration: 3000,
      });
    }
    
    // Ocultar o validador após alguns segundos
    setTimeout(() => setShowKeyValidator(false), 5000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Armazenar o arquivo original
      setImage(file);
      
      // Converter para base64 usando FileReader para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setResultado(null);
        setCurrentStep(DiagnosisStep.QUESTIONS);
      };
      reader.readAsDataURL(file);
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });

  const handleQuestionsSubmit = async (questions: DiagnosisQuestions) => {
    if (!image && !preview) {
      toast.error("Envie uma imagem antes de analisar.");
      return;
    }

    try {
      setLoading(true);
      setCurrentStep(DiagnosisStep.ANALYZING);
      setIsUsingFallback(false);
      
      // Se não houver imageUrl nos dados, extrair base64 da imagem 
      // (método antigo para compatibilidade)
      let base64Image = "";
      if (image) {
        base64Image = await toBase64(image);
      }
      
      try {
        // Usar a API com o novo método
        const result = await analyzePlantWithAI(base64Image, questions);
        
        console.log("AI Analysis result:", result);
        setResultado(result);
        
        if (!questions.imageUrl && !import.meta.env.VITE_OPENAI_API_KEY) {
          setIsUsingFallback(true);
          toast.warning("Usando diagnóstico offline (sem IA). Configure a chave da API para análise avançada.", {
            duration: 5000,
          });
        } else {
          toast.success("Análise concluída com sucesso!");
        }
        
        setCurrentStep(DiagnosisStep.RESULT);
      } catch (error) {
        console.error("Erro:", error);
        setIsUsingFallback(true);
        
        if (error.message === "API key não configurada") {
          toast.warning("Usando diagnóstico offline (sem IA). Configure a chave da API para análise avançada.", {
            duration: 5000,
          });
          
          // Continuar com fallback
          const fallbackResult = await analyzePlantWithAI(base64Image, questions);
          setResultado(fallbackResult);
          setCurrentStep(DiagnosisStep.RESULT);
        } else {
          toast.error("Erro ao analisar a imagem.");
          setCurrentStep(DiagnosisStep.QUESTIONS);
        }
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao processar a imagem.");
      setCurrentStep(DiagnosisStep.QUESTIONS);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setPreview(null);
    setResultado(null);
    setCurrentStep(DiagnosisStep.UPLOAD);
    setIsUsingFallback(false);
  };

  const cancelQuestions = () => {
    // Go back to upload step without clearing the image
    setCurrentStep(DiagnosisStep.UPLOAD);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-12 md:py-10 bg-gradient-to-br from-green-50 to-white">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 text-center">
        Diagnóstico de Planta
      </h1>

      {/* Validador de API Key - oculto por padrão */}
      {showKeyValidator && (
        <ApiKeyValidator onValidationComplete={handleApiValidation} />
      )}

      {apiKeyConfigured === false && !showKeyValidator && (
        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-700" />
          <AlertTitle className="text-amber-800">Chave da API OpenAI não configurada corretamente</AlertTitle>
          <AlertDescription className="text-amber-700">
            Para análises precisas com IA, verifique sua chave da API OpenAI como VITE_OPENAI_API_KEY nas variáveis de ambiente.
            Sem uma chave de API válida, o sistema usará um banco de dados offline com precisão limitada.
          </AlertDescription>
        </Alert>
      )}

      {currentStep === DiagnosisStep.UPLOAD && (
        <>
          <ImageUploadArea
            captureImage={() => document.getElementById("fileInput")?.click()}
            handleImageUpload={handleImageUpload}
            showTips={showTips}
            setShowTips={setShowTips}
          />

          {preview && (
            <ImagePreview
              preview={preview}
              onCancel={() => {
                setImage(null);
                setPreview(null);
                setResultado(null);
              }}
              onAnalyze={() => setCurrentStep(DiagnosisStep.QUESTIONS)}
              loading={loading}
            />
          )}
        </>
      )}

      {currentStep === DiagnosisStep.QUESTIONS && preview && (
        <DiagnosisQuestionnaire
          imagePreview={preview}
          imageFile={image}
          onSubmit={handleQuestionsSubmit}
          onCancel={cancelQuestions}
        />
      )}

      {currentStep === DiagnosisStep.ANALYZING && (
        <AnalyzingState isUsingFallback={isUsingFallback} />
      )}

      {currentStep === DiagnosisStep.RESULT && resultado && (
        <div className="mt-6 animate-fade-in">
          <ResultCard 
            result={resultado} 
            onNewAnalysis={resetAnalysis}
          />
        </div>
      )}

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
