
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { DiagnosisQuestions, DiagnosisResult, analyzePlantWithAI } from "@/services/openai-api";
import ImageUploadArea from "@/components/plant-diagnosis/ImageUploadArea";
import ImagePreview from "@/components/plant-diagnosis/ImagePreview";
import ResultCard from "@/components/plant-diagnosis/ResultCard";
import DiagnosisQuestionnaireEn from "@/components/plant-diagnosis/DiagnosisQuestionnaireEn";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnalyzingState } from "@/components/plant-diagnosis/AnalyzingState";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

enum DiagnosisStep {
  UPLOAD,
  QUESTIONS,
  ANALYZING,
  RESULT
}

export default function PlantDiagnosis() {
  const isMobile = useIsMobile();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<DiagnosisResult | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [currentStep, setCurrentStep] = useState<DiagnosisStep>(DiagnosisStep.UPLOAD);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if API key is configured
    const hasApiKey = !!import.meta.env.VITE_OPENAI_API_KEY;
    setApiKeyConfigured(hasApiKey);
    
    if (!hasApiKey) {
      toast.warning("OpenAI API key not configured. The app will use fallback mode.", {
        duration: 5000,
      });
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Converter para base64 usando FileReader em vez de URL.createObjectURL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string; // Resultado já é uma data URL completa
        setPreview(result);
        setImage(file);
        setResultado(null);
        setCurrentStep(DiagnosisStep.QUESTIONS);
      };
      reader.readAsDataURL(file); // Isso gera uma data URL completa com o formato correto
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
    if (!image) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setCurrentStep(DiagnosisStep.ANALYZING);
      setIsUsingFallback(false);
      
      // Extrair base64 da imagem
      const base64Image = await toBase64(image);
      
      try {
        // Usar a API OpenAI diretamente
        const result = await analyzePlantWithAI(base64Image, questions);
        
        console.log("AI Analysis result:", result);
        setResultado(result);
        
        // Verificar se estamos usando fallback
        if (!import.meta.env.VITE_OPENAI_API_KEY) {
          setIsUsingFallback(true);
          toast.warning("Using offline diagnosis (no AI). Configure API key for advanced analysis.", {
            duration: 5000,
          });
        } else {
          toast.success("Analysis completed successfully!");
        }
        
        setCurrentStep(DiagnosisStep.RESULT);
      } catch (error) {
        console.error("Error:", error);
        setIsUsingFallback(true);
        
        if (error.message === "API key não configurada") {
          toast.warning("Using offline diagnosis (no AI). Configure API key for advanced analysis.", {
            duration: 5000,
          });
          
          // Continuar com fallback
          const fallbackResult = await analyzePlantWithAI(base64Image, questions);
          setResultado(fallbackResult);
          setCurrentStep(DiagnosisStep.RESULT);
        } else {
          toast.error("Error analyzing the image.");
          setCurrentStep(DiagnosisStep.QUESTIONS);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error processing the image.");
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
        Plant Diagnosis
      </h1>

      {apiKeyConfigured === false && (
        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-700" />
          <AlertTitle className="text-amber-800">OpenAI API Key Not Configured</AlertTitle>
          <AlertDescription className="text-amber-700">
            For accurate AI analysis, please add your OpenAI API key as VITE_OPENAI_API_KEY in the environment variables.
            Without an API key, the system will use a fallback database with limited accuracy.
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
        <DiagnosisQuestionnaireEn
          imagePreview={preview}
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
