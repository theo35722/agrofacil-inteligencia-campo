import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { DiagnosisQuestions } from "@/services/openai-api";
import { useLocationName } from "@/hooks/use-location-name";
import { uploadImage } from "@/utils/image-upload";
import { analyzePlantImage } from "@/services/plant-analysis-service";
import { UseQuestionnaireFormProps, UseQuestionnaireFormReturn } from "./types";

export function useQuestionnaireForm({
  onSubmit,
  imagePreview,
  imageFile,
  locale = "pt"
}: UseQuestionnaireFormProps): UseQuestionnaireFormReturn {
  const { locationName, setLocationName, isLoading: locationLoading, error: locationError } = useLocationName();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 2; // Reduced from 6 to 2
  
  const [formData, setFormData] = useState<DiagnosisQuestions>({
    culture: "",
    symptoms: "",
    // Default values for fields we're keeping but not asking user about
    affectedArea: "whole_plant",
    timeFrame: "recent",
    recentProducts: locale === "pt" ? "Não" : "No",
    weatherChanges: "",
  });

  // Update location in form data when locationName changes
  useEffect(() => {
    if (locationName) {
      setFormData(prev => ({ ...prev, location: locationName }));
    }
  }, [locationName]);
  
  const handleChange = (field: keyof DiagnosisQuestions, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    let canContinue = true;
    
    switch (step) {
      case 1: canContinue = !!formData.culture; break;
      case 2: canContinue = !!formData.symptoms; break;
    }
    
    if (canContinue) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const clearLocation = () => {
    setLocationName(null);
    setFormData(prev => ({ ...prev, location: undefined }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // 1. Upload image to Supabase Storage
      const imageUrl = await uploadImage(imageFile, imagePreview, locale);
      
      if (!imageUrl) {
        toast.error(locale === "pt" 
          ? "Não foi possível fazer upload da imagem" 
          : "Could not upload image");
        setIsLoading(false);
        return;
      }

      toast.success(locale === "pt" 
        ? "Imagem enviada com sucesso! Analisando..." 
        : "Image uploaded successfully! Analyzing...");

      // 2. Call Edge Function with image URL and form data
      const result = await analyzePlantImage(imageUrl, formData);
      
      // 3. Process result and pass to onSubmit handler
      toast.success(locale === "pt" ? "Análise concluída!" : "Analysis completed!");
      onSubmit({
        ...formData,
        imageUrl  // Add image URL to data
      });

    } catch (error) {
      console.error("Error in submission process:", error);
      toast.error(locale === "pt" 
        ? "Erro na análise. Verifique sua conexão." 
        : "Analysis error. Check your connection.");
      setIsLoading(false);
    }
  };

  return {
    step,
    setStep,
    totalSteps,
    formData,
    isLoading,
    locationName,
    locationLoading,
    locationError,
    handleChange,
    handleContinue,
    clearLocation,
    handleSubmit
  };
}
