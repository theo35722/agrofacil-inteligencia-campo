
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

const DiagnosisQuestionnaireEn: React.FC<DiagnosisQuestionnaireProps> = ({
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
            alt="Image preview" 
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
          Step {step} of {totalSteps}
        </p>
        
        {/* Step 1: Culture */}
        {step === 1 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">What crop is this?</Label>
            <Select
              value={formData.culture}
              onValueChange={(value) => handleChange("culture", value)}
            >
              <SelectTrigger className="w-full p-3 h-auto text-base">
                <SelectValue placeholder="Select the crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="milho">Corn</SelectItem>
                <SelectItem value="soja">Soybean</SelectItem>
                <SelectItem value="tomate">Tomato</SelectItem>
                <SelectItem value="algodao">Cotton</SelectItem>
                <SelectItem value="cafe">Coffee</SelectItem>
                <SelectItem value="trigo">Wheat</SelectItem>
                <SelectItem value="feijao">Beans</SelectItem>
                <SelectItem value="arroz">Rice</SelectItem>
                <SelectItem value="citros">Citrus (Orange, Lemon)</SelectItem>
                <SelectItem value="outro">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Step 2: Symptoms */}
        {step === 2 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">What symptoms do you observe?</Label>
            <Textarea
              value={formData.symptoms}
              onChange={(e) => handleChange("symptoms", e.target.value)}
              placeholder="Ex: yellow spots, dry leaves, wilting..."
              className="min-h-[100px] text-base p-3"
            />
          </div>
        )}
        
        {/* Step 3: Affected Area */}
        {step === 3 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">Where do the symptoms appear?</Label>
            <Select
              value={formData.affectedArea}
              onValueChange={(value) => handleChange("affectedArea", value)}
            >
              <SelectTrigger className="w-full p-3 h-auto text-base">
                <SelectValue placeholder="Select the affected area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="folhas">Leaves</SelectItem>
                <SelectItem value="caule">Stem/Trunk</SelectItem>
                <SelectItem value="raiz">Root</SelectItem>
                <SelectItem value="frutos">Fruits</SelectItem>
                <SelectItem value="flores">Flowers</SelectItem>
                <SelectItem value="planta_toda">Whole plant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Step 4: Time Frame */}
        {step === 4 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">How long ago did the symptoms appear?</Label>
            <Select
              value={formData.timeFrame}
              onValueChange={(value) => handleChange("timeFrame", value)}
            >
              <SelectTrigger className="w-full p-3 h-auto text-base">
                <SelectValue placeholder="Select the time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3 dias">1-3 days</SelectItem>
                <SelectItem value="4-7 dias">4-7 days</SelectItem>
                <SelectItem value="1-2 semanas">1-2 weeks</SelectItem>
                <SelectItem value="2-4 semanas">2-4 weeks</SelectItem>
                <SelectItem value="mais de 1 mes">More than 1 month</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Location Information */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <Map className="w-5 h-5 text-gray-500 mr-2" />
                <Label className="text-base font-medium">Your location</Label>
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
                    ? "Location not available. Permission denied." 
                    : location.latitude 
                      ? "Loading location..." 
                      : "Location not available."}
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
            {step === 1 ? "Cancel" : "Back"}
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
                Analyzing...
              </>
            ) : step === totalSteps ? (
              "Analyze"
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisQuestionnaireEn;
