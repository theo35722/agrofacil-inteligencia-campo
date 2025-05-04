
import { useState } from "react";
import { Camera, Image, ArrowRight, Upload, Info, Calendar, Thermometer, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

enum DiagnosisStep {
  Upload,
  Analyzing,
  Result
}

const PlantDiagnosis = () => {
  const [step, setStep] = useState<DiagnosisStep>(DiagnosisStep.Upload);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("diagnosis");
  
  // Mock diagnosis result
  const diagnosisResult = {
    disease: "Ferrugem asiática",
    scientificName: "Phakopsora pachyrhizi",
    severity: "Moderada",
    affectedArea: "Folhas",
    spreadRisk: "Alto",
    recommendations: [
      {
        product: "Fungicida XYZ",
        activeIngredient: "Azoxistrobina + Ciproconazol",
        dosage: "500ml/ha",
        application: "Pulverização foliar",
        timing: "Aplicar nas primeiras horas da manhã ou final da tarde",
        interval: "Reaplicar após 14-21 dias",
        weather: "Evitar aplicação com previsão de chuva nas próximas 4 horas",
        preharvest: "30 dias de carência"
      }
    ],
    preventiveMeasures: [
      "Rotação de culturas com espécies não hospedeiras",
      "Eliminação de plantas voluntárias",
      "Monitoramento constante da lavoura",
      "Plantio de variedades resistentes quando disponíveis"
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
    setActiveTab("diagnosis");
  };

  const photoTips = [
    {
      title: "Iluminação adequada",
      description: "Tire fotos com boa iluminação natural, evitando sombras fortes ou reflexos."
    },
    {
      title: "Foco nos sintomas",
      description: "Capture claramente a área afetada da planta, mostrando os sintomas visíveis."
    },
    {
      title: "Várias perspectivas",
      description: "Tire fotos de diferentes ângulos e distâncias para melhor análise."
    },
    {
      title: "Inclua referências",
      description: "Se possível, inclua uma folha saudável para comparação com a área afetada."
    }
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-agro-green-800 mb-2">
          Diagnóstico de Planta
        </h1>
        <p className="text-gray-600">
          Tire uma foto da sua planta para identificar problemas e obter recomendações detalhadas de tratamento
        </p>
      </div>
      
      {step !== DiagnosisStep.Upload && (
        <Alert className="bg-agro-green-50 border-agro-green-100 text-agro-green-800">
          <Info className="h-4 w-4" />
          <AlertTitle>Como funciona o diagnóstico?</AlertTitle>
          <AlertDescription>
            Nossa tecnologia de IA analisa imagens de plantas para identificar doenças, pragas e deficiências
            nutricionais com alta precisão, fornecendo recomendações personalizadas para tratamento.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="agro-card">
        <CardContent className="pt-6">
          {step === DiagnosisStep.Upload && (
            <div className="space-y-6">
              <Alert className="bg-agro-green-50 border-agro-green-100 text-agro-green-800">
                <Info className="h-4 w-4" />
                <AlertTitle>Como funciona o diagnóstico?</AlertTitle>
                <AlertDescription>
                  Nossa tecnologia de IA analisa imagens de plantas para identificar doenças, pragas e deficiências
                  nutricionais com alta precisão, fornecendo recomendações personalizadas para tratamento.
                </AlertDescription>
              </Alert>
              
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
                  
                  {/* Dicas para fotos melhores */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-agro-green-700 mb-3">
                      Dicas para melhores resultados:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {photoTips.map((tip, index) => (
                        <div 
                          key={index}
                          className="p-3 bg-gray-50 border border-gray-100 rounded-md"
                        >
                          <p className="text-sm font-medium text-agro-green-700">{tip.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                        </div>
                      ))}
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
                    <p className="text-sm text-gray-500 italic">
                      {diagnosisResult.scientificName}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Severidade</Label>
                      <p className="font-medium text-orange-600">
                        {diagnosisResult.severity}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Risco de disseminação</Label>
                      <p className="font-medium text-red-600">
                        {diagnosisResult.spreadRisk}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Tabs 
                defaultValue="treatment" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="treatment">Tratamento</TabsTrigger>
                  <TabsTrigger value="application">Aplicação</TabsTrigger>
                  <TabsTrigger value="prevention">Prevenção</TabsTrigger>
                </TabsList>
                
                <TabsContent value="treatment" className="space-y-4">
                  <h3 className="font-semibold text-agro-green-700 mb-3">Produtos Recomendados</h3>
                  
                  {diagnosisResult.recommendations.map((rec, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-agro-green-50 border border-agro-green-200 rounded-md mb-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-agro-green-800 text-lg">{rec.product}</p>
                          <p className="text-sm text-gray-600">{rec.activeIngredient}</p>
                        </div>
                        <span className="bg-agro-green-100 text-agro-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                          Recomendado
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Dosagem:</p>
                          <p className="text-sm">{rec.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Aplicação:</p>
                          <p className="text-sm">{rec.application}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Intervalo:</p>
                          <p className="text-sm">{rec.interval}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Carência:</p>
                          <p className="text-sm">{rec.preharvest}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="application" className="space-y-4">
                  <h3 className="font-semibold text-agro-green-700 mb-3">Instruções de Aplicação</h3>
                  
                  <div className="space-y-4">
                    {diagnosisResult.recommendations.map((rec, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-agro-green-50 border border-agro-green-200 rounded-md"
                      >
                        <h4 className="font-medium text-agro-green-800 mb-3">{rec.product}</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-agro-green-600 mr-3 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700">Melhor horário</p>
                              <p className="text-sm text-gray-600">{rec.timing}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <CloudRain className="h-5 w-5 text-agro-green-600 mr-3 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700">Condições climáticas</p>
                              <p className="text-sm text-gray-600">{rec.weather}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Thermometer className="h-5 w-5 text-agro-green-600 mr-3 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-700">Temperatura ideal</p>
                              <p className="text-sm text-gray-600">Entre 18°C e 28°C, sem ventos fortes</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                      <h4 className="font-medium text-yellow-800 mb-2">Equipamentos de proteção</h4>
                      <p className="text-sm text-gray-700">
                        Sempre utilize equipamentos de proteção individual (EPIs) durante a aplicação: 
                        luvas, máscara, óculos de proteção, macacão e botas.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="prevention" className="space-y-4">
                  <h3 className="font-semibold text-agro-green-700 mb-3">Medidas Preventivas</h3>
                  
                  <div className="space-y-3">
                    {diagnosisResult.preventiveMeasures.map((measure, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-agro-green-50 border border-agro-green-200 rounded-md"
                      >
                        <p className="text-agro-green-800">• {measure}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
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
