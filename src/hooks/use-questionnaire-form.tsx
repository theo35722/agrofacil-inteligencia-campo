import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { DiagnosisQuestions } from "@/services/openai-api";
import { useLocationName } from "@/hooks/use-location-name";

interface UseQuestionnaireFormProps {
  onSubmit: (data: DiagnosisQuestions) => void;
  imagePreview: string;
  imageFile?: File;
  locale?: "pt" | "en";
}

export function useQuestionnaireForm({
  onSubmit,
  imagePreview,
  imageFile,
  locale = "pt"
}: UseQuestionnaireFormProps) {
  const { locationName, setLocationName, isLoading: locationLoading, error: locationError } = useLocationName();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  
  const [formData, setFormData] = useState<DiagnosisQuestions>({
    culture: "",
    symptoms: "",
    affectedArea: "",
    timeFrame: "",
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
      case 2: canContinue = !!formData.affectedArea; break;
      case 3: canContinue = !!formData.symptoms; break;
      case 4: canContinue = !!formData.timeFrame; break;
      case 5: canContinue = !!formData.recentProducts; break;
      case 6: canContinue = true; break;
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

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile && !imagePreview) {
      toast.error(locale === "pt" ? "Imagem não encontrada" : "Image not found");
      return null;
    }

    try {
      // Se temos um File, usamos ele diretamente
      if (imageFile) {
        const fileName = `plant_${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        
        const { data, error } = await supabase.storage
          .from('plant-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        // Obter a URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('plant-images')
          .getPublicUrl(data.path);

        return publicUrl;
      } 
      // Se não temos um File mas temos uma string base64, convertemos para um File
      else if (imagePreview) {
        // Converter base64 para blob
        const base64Response = await fetch(imagePreview);
        const blob = await base64Response.blob();
        
        // Criar um nome de arquivo único
        const fileName = `plant_${Date.now()}.jpg`;
        
        const { data, error } = await supabase.storage
          .from('plant-images')
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        // Obter a URL pública da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('plant-images')
          .getPublicUrl(data.path);

        return publicUrl;
      }
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast.error(locale === "pt" 
        ? "Erro ao fazer upload da imagem" 
        : "Error uploading image");
      return null;
    }
    
    return null;
  };

  const callAnalysisFunction = async (imageUrl: string, formData: DiagnosisQuestions) => {
    try {
      const response = await supabase.functions.invoke('analyze-plant-image', {
        body: {
          imageUrl,
          ...formData
        }
      });

      if (!response.data) {
        throw new Error("Resposta vazia da análise");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao chamar Edge Function:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // 1. Upload da imagem para o Supabase Storage
      const imageUrl = await uploadImage();
      
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

      // 2. Chamar a Edge Function com a URL da imagem e os dados do formulário
      const result = await callAnalysisFunction(imageUrl, formData);
      
      // 3. Processar o resultado e passar para o manipulador onSubmit
      toast.success(locale === "pt" ? "Análise concluída!" : "Analysis completed!");
      onSubmit({
        ...formData,
        imageUrl  // Adicionar a URL da imagem aos dados
      });

    } catch (error) {
      console.error("Erro no processo de submissão:", error);
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
