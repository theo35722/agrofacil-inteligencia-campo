
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, ArrowRight, Map, X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { DiagnosisQuestions } from "@/services/openai-api";
import { useGeolocation } from "@/hooks/use-geolocation";

interface DiagnosisQuestionnaireProps {
  imagePreview: string;
  onSubmit: (data: DiagnosisQuestions) => void;
  onCancel: () => void;
}

const DiagnosisQuestionnaire: React.FC<DiagnosisQuestionnaireProps> = ({
  imagePreview,
  onSubmit,
  onCancel
}) => {
  const location = useGeolocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<DiagnosisQuestions>({
    culture: "",
    symptoms: "",
    affectedArea: "",
    timeFrame: "",
  });
  const [locationName, setLocationName] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Fetch location name if coordinates are available
  useEffect(() => {
    const fetchLocationName = async () => {
      if (location.latitude && location.longitude) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
          );
          const data = await response.json();
          
          if (data.address) {
            const address = data.address;
            const locationStr = [
              address.city || address.town || address.village,
              address.state
            ].filter(Boolean).join(", ");
            
            setLocationName(locationStr);
            setFormData(prev => ({
              ...prev,
              location: locationStr
            }));
          }
        } catch (error) {
          console.error("Error fetching location name:", error);
        }
      }
    };

    fetchLocationName();
  }, [location.latitude, location.longitude]);

  const handleChange = (field: keyof DiagnosisQuestions, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    // Simple validation before continuing
    let canContinue = true;
    
    switch (step) {
      case 1:
        canContinue = !!formData.culture;
        break;
      case 2:
        canContinue = !!formData.symptoms;
        break;
      case 3:
        canContinue = !!formData.affectedArea;
        break;
      case 4:
        canContinue = !!formData.timeFrame;
        break;
    }
    
    if (canContinue) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    onSubmit(formData);
  };

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col space-y-4">
        {/* Image Preview */}
        <div className="rounded-lg overflow-hidden border border-green-200">
          <img 
            src={imagePreview} 
            alt="Prévia da imagem" 
            className="w-full object-cover max-h-56"
          />
        </div>
        
        {/* Progress Indicator */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 text-center">
          Passo {step} de {totalSteps}
        </p>
        
        {/* Step 1: Culture */}
        {step === 1 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">Qual é a cultura?</Label>
            <Select
              value={formData.culture}
              onValueChange={(value) => handleChange("culture", value)}
            >
              <SelectTrigger className="w-full p-3 h-auto text-base">
                <SelectValue placeholder="Selecione a cultura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="milho">Milho</SelectItem>
                <SelectItem value="soja">Soja</SelectItem>
                <SelectItem value="tomate">Tomate</SelectItem>
                <SelectItem value="algodao">Algodão</SelectItem>
                <SelectItem value="cafe">Café</SelectItem>
                <SelectItem value="trigo">Trigo</SelectItem>
                <SelectItem value="feijao">Feijão</SelectItem>
                <SelectItem value="arroz">Arroz</SelectItem>
                <SelectItem value="citros">Cítros (Laranja, Limão)</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Step 2: Symptoms */}
        {step === 2 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">Quais sintomas você observa?</Label>
            <Textarea
              value={formData.symptoms}
              onChange={(e) => handleChange("symptoms", e.target.value)}
              placeholder="Ex: manchas amarelas, folhas secas, murchamento..."
              className="min-h-[100px] text-base p-3"
            />
          </div>
        )}
        
        {/* Step 3: Affected Area */}
        {step === 3 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">Onde aparecem os sintomas?</Label>
            <Select
              value={formData.affectedArea}
              onValueChange={(value) => handleChange("affectedArea", value)}
            >
              <SelectTrigger className="w-full p-3 h-auto text-base">
                <SelectValue placeholder="Selecione a área afetada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="folhas">Folhas</SelectItem>
                <SelectItem value="caule">Caule/Tronco</SelectItem>
                <SelectItem value="raiz">Raiz</SelectItem>
                <SelectItem value="frutos">Frutos</SelectItem>
                <SelectItem value="flores">Flores</SelectItem>
                <SelectItem value="planta_toda">Planta toda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Step 4: Time Frame */}
        {step === 4 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">Há quanto tempo surgiram os sintomas?</Label>
            <Select
              value={formData.timeFrame}
              onValueChange={(value) => handleChange("timeFrame", value)}
            >
              <SelectTrigger className="w-full p-3 h-auto text-base">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3 dias">1-3 dias</SelectItem>
                <SelectItem value="4-7 dias">4-7 dias</SelectItem>
                <SelectItem value="1-2 semanas">1-2 semanas</SelectItem>
                <SelectItem value="2-4 semanas">2-4 semanas</SelectItem>
                <SelectItem value="mais de 1 mes">Mais de 1 mês</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Location Information */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <Map className="w-5 h-5 text-gray-500 mr-2" />
                <Label className="text-base font-medium">Sua localização</Label>
              </div>
              
              {locationName ? (
                <div className="bg-green-50 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-green-800">{locationName}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setLocationName(null);
                      setFormData(prev => ({ ...prev, location: undefined }));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {location.error 
                    ? "Localização não disponível. Permissão negada." 
                    : location.latitude 
                      ? "Carregando localização..." 
                      : "Localização não disponível."}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={step === 1 ? onCancel : () => setStep(step - 1)}
          >
            {step === 1 ? "Cancelar" : "Voltar"}
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={isLoading || (
              (step === 1 && !formData.culture) ||
              (step === 2 && !formData.symptoms) ||
              (step === 3 && !formData.affectedArea) ||
              (step === 4 && !formData.timeFrame)
            )}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : step === totalSteps ? (
              "Analisar"
            ) : (
              <>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisQuestionnaire;
