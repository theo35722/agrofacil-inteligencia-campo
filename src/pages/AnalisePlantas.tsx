
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, ImageIcon, LoaderCircle, Share2, Info } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { analyzePlantImage, getDetailedDiagnosis, DiseaseDiagnosis } from "@/services/plantnet-api";
import { DiagnosisResult } from "@/components/plant-diagnosis/DiagnosisResult";
import { ImagePreview } from "@/components/plant-diagnosis/ImagePreview";
import { ImageUploadArea } from "@/components/plant-diagnosis/ImageUploadArea";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function AnalisePlantas() {
  const isMobile = useIsMobile();
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // remove "data:image/jpeg;base64,"
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [detailedDiagnosis, setDetailedDiagnosis] = useState<DiseaseDiagnosis | null>(null);
  const [showPhotoTips, setShowPhotoTips] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setApiResponse(null);
      setDetailedDiagnosis(null);
      console.log("Arquivo carregado:", file.name);
    }
  };

  const resetDiagnosis = () => {
    setImage(null);
    setPreview(null);
    setApiResponse(null);
    setDetailedDiagnosis(null);
  };

  const captureImage = () => {
    // Simulação de abertura da câmera nativa
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => handleUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  const analisar = async () => {
    if (!image) {
      toast.error("Nenhuma imagem foi enviada para análise.");
      return;
    }

    try {
      setLoading(true);
      setApiResponse(null);
      
      // Converter imagem para base64
      const base64Image = await toBase64(image);

      // Chamar a API Plant.id
      console.log("Enviando imagem para análise...");
      const result = await analyzePlantImage(base64Image);
      
      console.log("Resposta completa da Plant.id:", result);
      setApiResponse(result);
      
      // Processar o diagnóstico detalhado
      const diagnosis = getDetailedDiagnosis(result);
      setDetailedDiagnosis(diagnosis);
      
      setLoading(false);
      toast.success("Análise concluída com sucesso!");
    } catch (error) {
      console.error("Erro ao analisar planta:", error);
      toast.error("Erro ao analisar a planta. Verifique sua conexão e tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-50 to-white px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Análise de Plantas</h1>
      
      <p className="text-center text-green-700 max-w-xl mb-6 text-sm sm:text-base">
        Envie uma foto da sua planta para analisarmos a saúde dela com inteligência artificial.
      </p>

      {!preview && (
        <div className="w-full max-w-md animate-fade-in">
          <ImageUploadArea
            captureImage={captureImage}
            handleImageUpload={handleUpload}
          />
        </div>
      )}

      {preview && !loading && !detailedDiagnosis && (
        <Card className="w-full max-w-md mb-6 shadow-md animate-fade-in">
          <CardContent className="p-4">
            <ImagePreview 
              imagePreview={preview}
              resetDiagnosis={resetDiagnosis}
              startAnalysis={analisar}
            />
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
          <LoaderCircle className="h-12 w-12 text-agro-green-600 animate-spin mb-4" />
          <p className="text-agro-green-700 font-medium">Analisando sua planta...</p>
          <p className="text-gray-500 text-sm mt-1">Isso pode levar alguns segundos</p>
        </div>
      )}

      {detailedDiagnosis && !loading && (
        <div className="mt-4 max-w-3xl w-full animate-fade-in">
          <DiagnosisResult 
            imagePreview={preview!}
            diagnosisResult={detailedDiagnosis}
            apiResponse={apiResponse}
            resetDiagnosis={resetDiagnosis}
          />
          
          {/* Botão de compartilhar */}
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className="bg-white text-agro-green-700 border-agro-green-300 hover:bg-agro-green-50"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Diagnóstico de Planta: ${detailedDiagnosis.disease}`,
                    text: `Análise de saúde da planta: ${detailedDiagnosis.disease}. Nível de confiança: ${detailedDiagnosis.confidence}%. Verifique os detalhes completos no app AgroFácil.`,
                  }).catch(err => {
                    console.log('Erro ao compartilhar:', err);
                    toast.error('Não foi possível compartilhar o diagnóstico');
                  });
                } else {
                  toast.error('Compartilhamento não suportado neste dispositivo');
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar diagnóstico
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
