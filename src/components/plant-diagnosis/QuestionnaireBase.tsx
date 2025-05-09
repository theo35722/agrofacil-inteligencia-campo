
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { QuestionnaireProgress } from "./QuestionnaireProgress";
import { LocationDisplay } from "./LocationDisplay";
import { StepCulture } from "./steps/StepCulture";
import { StepAffectedArea } from "./steps/StepAffectedArea";
import { StepSymptoms } from "./steps/StepSymptoms";
import { StepTimeFrame } from "./steps/StepTimeFrame";
import { StepProducts } from "./steps/StepProducts";
import { StepWeather } from "./steps/StepWeather";
import { DiagnosisQuestions } from "@/services/openai-api";
import { useLocationName } from "@/hooks/use-location-name";
import { supabase } from "@/integrations/supabase/client";

interface QuestionnaireBaseProps {
  imagePreview: string;
  imageFile?: File;
  onSubmit: (data: DiagnosisQuestions) => void;
  onCancel: () => void;
  locale?: "pt" | "en";
}

export const QuestionnaireBase: React.FC<QuestionnaireBaseProps> = ({ 
  imagePreview, 
  imageFile,
  onSubmit, 
  onCancel,
  locale = "pt" 
}) => {
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

  const clearLocation = () => {
    setLocationName(null);
    setFormData(prev => ({ ...prev, location: undefined }));
  };

  const translations = {
    pt: {
      imageAlt: "Prévia da imagem",
      stepLabel: "Passo",
      buttons: {
        cancel: "Cancelar",
        back: "Voltar",
        next: "Continuar", 
        analyze: "Analisar",
        analyzing: "Analisando..."
      },
      location: {
        title: "Sua localização",
        loading: "Carregando localização...",
        error: "Localização não disponível. Permissão negada."
      }
    },
    en: {
      imageAlt: "Image preview",
      stepLabel: "Step",
      buttons: {
        cancel: "Cancel",
        back: "Back",
        next: "Continue",
        analyze: "Analyze",
        analyzing: "Analyzing..."
      },
      location: {
        title: "Your location",
        loading: "Loading location...",
        error: "Location not available. Permission denied."
      }
    }
  };
  
  const t = translations[locale];

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col space-y-4">
        {/* Image Preview */}
        <div className="rounded-lg overflow-hidden border border-green-200">
          <img 
            src={imagePreview} 
            alt={t.imageAlt} 
            className="w-full object-cover max-h-56"
          />
        </div>
        
        {/* Progress Indicator */}
        <QuestionnaireProgress 
          currentStep={step} 
          totalSteps={totalSteps} 
          stepLabels={t.stepLabel}
        />
        
        {/* Step Content */}
        {step === 1 && (
          <StepCulture 
            culture={formData.culture} 
            onChange={(value) => handleChange("culture", value)}
            locale={locale}
          />
        )}
        
        {step === 2 && (
          <StepAffectedArea 
            affectedArea={formData.affectedArea} 
            onChange={(value) => handleChange("affectedArea", value)}
            locale={locale}
          />
        )}
        
        {step === 3 && (
          <StepSymptoms 
            symptoms={formData.symptoms} 
            onChange={(value) => handleChange("symptoms", value)}
            locale={locale}
          />
        )}
        
        {step === 4 && (
          <StepTimeFrame 
            timeFrame={formData.timeFrame} 
            onChange={(value) => handleChange("timeFrame", value)}
            locale={locale}
          />
        )}
        
        {step === 5 && (
          <StepProducts 
            recentProducts={formData.recentProducts || ""} 
            onChange={(value) => handleChange("recentProducts", value)}
            locale={locale}
          />
        )}
        
        {step === 6 && (
          <>
            <StepWeather 
              weatherChanges={formData.weatherChanges || ""} 
              onChange={(value) => handleChange("weatherChanges", value)}
              locale={locale}
            />
            
            {/* Location Information */}
            <LocationDisplay 
              locationName={locationName} 
              isLoading={locationLoading} 
              error={locationError} 
              onClear={clearLocation}
              label={t.location.title}
              loadingMessage={t.location.loading}
              errorMessage={t.location.error}
            />
          </>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={step === 1 ? onCancel : () => setStep(step - 1)}
          >
            {step === 1 ? t.buttons.cancel : t.buttons.back}
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={isLoading || (
              (step === 1 && !formData.culture) ||
              (step === 2 && !formData.affectedArea) ||
              (step === 3 && !formData.symptoms) ||
              (step === 4 && !formData.timeFrame) ||
              (step === 5 && !formData.recentProducts)
            )}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {t.buttons.analyzing}
              </>
            ) : step === totalSteps ? (
              t.buttons.analyze
            ) : (
              <>
                {t.buttons.next}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
