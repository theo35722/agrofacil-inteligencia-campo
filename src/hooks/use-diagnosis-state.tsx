
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { DiagnosisQuestions, DiagnosisResult, analyzePlantWithAI } from "@/services/openai-api";
import { DiagnosisStep } from "@/components/plant-diagnosis/DiagnosisContainer";

export const useDiagnosisState = (locale: "pt" | "en") => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<DiagnosisResult | null>(null);
  const [showTips, setShowTips] = useState(false); // Changed from true to false
  const [currentStep, setCurrentStep] = useState<DiagnosisStep>(DiagnosisStep.UPLOAD);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  const [showKeyValidator, setShowKeyValidator] = useState(false);

  useEffect(() => {
    // Check if API key is configured
    const hasApiKey = !!import.meta.env.VITE_OPENAI_API_KEY;
    setApiKeyConfigured(hasApiKey);
    
    if (!hasApiKey) {
      console.log(`${locale === "pt" ? "Chave da API OpenAI não configurada" : "OpenAI API key not configured"}. The app will use fallback mode silently.`);
    }
  }, [locale]);

  const handleApiValidation = (isValid: boolean) => {
    console.log(`API Key ${isValid ? "válida" : "inválida"}:`, isValid);
    setApiKeyConfigured(isValid);
    
    if (isValid) {
      toast.success(
        locale === "pt" 
          ? "Chave da API OpenAI validada com sucesso!" 
          : "OpenAI API key validated successfully!",
        { duration: 3000 }
      );
    }
    
    // Hide validator after a few seconds
    setTimeout(() => setShowKeyValidator(false), 5000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the original file
      setImage(file);
      
      // Convert to base64 using FileReader for preview
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
      toast.error(locale === "pt" ? "Envie uma imagem antes de analisar." : "Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setCurrentStep(DiagnosisStep.ANALYZING);
      setIsUsingFallback(false);
      
      // If there's no imageUrl in the data, extract base64 from image
      let base64Image = "";
      if (image) {
        base64Image = await toBase64(image);
      }
      
      try {
        // Use API with the new method
        const result = await analyzePlantWithAI(base64Image, questions);
        
        console.log("AI Analysis result:", result);
        setResultado(result);
        
        // Check if we're using fallback
        if (!questions.imageUrl && !import.meta.env.VITE_OPENAI_API_KEY) {
          setIsUsingFallback(true);
          toast.warning(
            locale === "pt" 
              ? "Usando diagnóstico offline (sem IA). Configure a chave da API para análise avançada." 
              : "Using offline diagnosis (no AI). Configure API key for advanced analysis.", 
            { duration: 5000 }
          );
        } else {
          toast.success(locale === "pt" ? "Análise concluída com sucesso!" : "Analysis completed successfully!");
        }
        
        setCurrentStep(DiagnosisStep.RESULT);
      } catch (error) {
        console.error("Error:", error);
        setIsUsingFallback(true);
        
        if (error.message === "API key não configurada") {
          toast.warning(
            locale === "pt" 
              ? "Usando diagnóstico offline (sem IA). Configure a chave da API para análise avançada." 
              : "Using offline diagnosis (no AI). Configure API key for advanced analysis.", 
            { duration: 5000 }
          );
          
          // Continue with fallback
          const fallbackResult = await analyzePlantWithAI(base64Image, questions);
          setResultado(fallbackResult);
          setCurrentStep(DiagnosisStep.RESULT);
        } else {
          toast.error(locale === "pt" ? "Erro ao analisar a imagem." : "Error analyzing the image.");
          setCurrentStep(DiagnosisStep.QUESTIONS);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(locale === "pt" ? "Erro ao processar a imagem." : "Error processing the image.");
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

  return {
    image,
    preview,
    loading,
    resultado,
    showTips,
    currentStep,
    isUsingFallback,
    apiKeyConfigured,
    showKeyValidator,
    setShowTips,
    setShowKeyValidator,
    handleApiValidation,
    handleImageUpload,
    handleQuestionsSubmit,
    resetAnalysis,
    cancelQuestions
  };
};
