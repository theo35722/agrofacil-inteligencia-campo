
import { useState } from "react";
import { Camera, Image, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

enum DiagnosisStep {
  Upload,
  Analyzing,
  Result
}

const PlantDiagnosis = () => {
  const [step, setStep] = useState<DiagnosisStep>(DiagnosisStep.Upload);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Mock diagnosis result
  const diagnosisResult = {
    disease: "Ferrugem asiática",
    severity: "Moderada",
    recommendations: [
      {
        product: "Fungicida XYZ",
        dosage: "500ml/ha",
        application: "Pulverização foliar"
      }
    ]
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const captureImage = () => {
    toast.info("Câmera iniciada");
    // In a real app, this would access the device camera
    // For now, let's simulate with a mock image
    setImagePreview("https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07");
  };
  
  const startAnalysis = () => {
    setStep(DiagnosisStep.Analyzing);
    // Simulate analysis time
    setTimeout(() => {
      setStep(DiagnosisStep.Result);
    }, 2000);
  };
  
  const resetDiagnosis = () => {
    setStep(DiagnosisStep.Upload);
    setImagePreview(null);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
          Diagnóstico de Planta
        </h1>
        <p className="text-gray-600">
          Tire uma foto da sua planta para identificar problemas e obter recomendações
        </p>
      </div>
      
      <Card className="agro-card">
        <CardContent className="pt-6">
          {step === DiagnosisStep.Upload && (
            <div className="space-y-6">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border border-agro-green-200">
                    <img 
                      src={imagePreview} 
                      alt="Prévia da imagem" 
                      className="w-full object-cover max-h-72"
                    />
                  </div>
                  
                  <div className="flex justify-between gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={resetDiagnosis}
                    >
                      Cancelar
                    </Button>
                    
                    <Button 
                      className="bg-agro-green-500 hover:bg-agro-green-600 flex-1"
                      onClick={startAnalysis}
                    >
                      Analisar <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div 
                    className="border-2 border-dashed border-agro-green-300 rounded-lg p-8
                      flex flex-col items-center justify-center text-center bg-agro-green-50"
                  >
                    <Image className="h-16 w-16 text-agro-green-400 mb-4" />
                    <p className="text-agro-green-800 font-medium">
                      Envie uma imagem da planta para diagnóstico
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Tire uma foto clara e bem iluminada da área afetada
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Button 
                        variant="outline" 
                        className="w-full h-20 border-agro-green-300 mb-2"
                        onClick={captureImage}
                      >
                        <div className="flex flex-col items-center">
                          <Camera className="h-6 w-6 mb-1 text-agro-green-600" />
                          <span>Tirar foto</span>
                        </div>
                      </Button>
                    </div>
                    
                    <div>
                      <Button
                        variant="outline"
                        className="w-full h-20 border-agro-green-300 mb-2"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <div className="flex flex-col items-center">
                          <Upload className="h-6 w-6 mb-1 text-agro-green-600" />
                          <span>Enviar foto</span>
                        </div>
                      </Button>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {step === DiagnosisStep.Analyzing && (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 border-4 border-agro-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-agro-green-800 font-medium">Analisando imagem...</p>
              <p className="text-gray-500 text-sm mt-2">
                Nossa IA está identificando possíveis problemas
              </p>
            </div>
          )}
          
          {step === DiagnosisStep.Result && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="sm:w-1/3">
                  <div className="rounded-lg overflow-hidden border border-agro-green-200 mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Imagem analisada" 
                      className="w-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="sm:w-2/3 space-y-4">
                  <div>
                    <Label className="text-gray-500">Diagnóstico</Label>
                    <p className="text-xl font-semibold text-agro-green-800">
                      {diagnosisResult.disease}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500">Severidade</Label>
                    <p className="font-medium text-orange-600">
                      {diagnosisResult.severity}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold text-agro-green-700 mb-3">Recomendações</h3>
                
                {diagnosisResult.recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-agro-green-50 border border-agro-green-200 rounded-md mb-3"
                  >
                    <p className="font-medium text-agro-green-800">{rec.product}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-700">
                      <div>
                        <span className="font-medium">Dosagem:</span> {rec.dosage}
                      </div>
                      <div>
                        <span className="font-medium">Aplicação:</span> {rec.application}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full bg-agro-green-500 hover:bg-agro-green-600"
                  onClick={resetDiagnosis}
                >
                  Novo Diagnóstico
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantDiagnosis;
