
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
import { enviarDadosParaWebhook } from "@/services/webhookService";

interface QuestionnaireBaseProps {
  imagePreview: string;
  onSubmit: (data: DiagnosisQuestions) => void;
  onCancel: () => void;
  locale?: "pt" | "en";
}

export const QuestionnaireBase: React.FC<QuestionnaireBaseProps> = ({ 
  imagePreview, 
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

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Verificar se imagePreview contém uma data URL válida
      if (!imagePreview || !imagePreview.startsWith("data:image/")) {
        console.error("Erro: imagePreview não é uma data URL válida");
        toast.error(locale === "pt" ? "Erro ao processar imagem. Formato inválido." : "Error processing image. Invalid format.");
        setIsLoading(false);
        return;
      }
      
      // Preparar os dados para envio
      const webhookData = {
        imagem: imagePreview,
        cultura: formData.culture,
        sintomas: formData.symptoms,
        parte_afetada: formData.affectedArea,
        tempo: formData.timeFrame,
        produtos: formData.recentProducts || "",
        clima: formData.weatherChanges || "",
        localizacao: locationName || "",
        timestamp: new Date().toLocaleString(locale === "pt" ? "pt-BR" : "en-US")
      };
      
      // Enviar dados para webhook
      const success = await enviarDadosParaWebhook(webhookData);
      
      if (success) {
        toast.success(locale === "pt" ? "Dados enviados com sucesso!" : "Data sent successfully!");
        onSubmit(formData);
      } else {
        toast.error(locale === "pt" ? "Erro ao enviar dados para análise" : "Error sending data for analysis");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error(locale === "pt" ? "Erro na análise. Verifique sua conexão." : "Analysis error. Check your connection.");
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
