
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { analyzePlantImage } from "@/services/plantnet-api";
import { ImagePreview } from "@/components/plant-diagnosis/ImagePreview";
import { ImageUploadArea } from "@/components/plant-diagnosis/ImageUploadArea";
import { ResultCard } from "@/components/plant-diagnosis/ResultCard";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AnalisePlantas() {
  const isMobile = useIsMobile();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);

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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResultado(null);
      console.log("Arquivo carregado:", file.name);
    }
  };

  const resetDiagnosis = () => {
    setImage(null);
    setPreview(null);
    setResultado(null);
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
      setResultado(null);
      
      // Converter imagem para base64
      const base64Image = await toBase64(image);

      // Chamar a API Plant.id
      console.log("Enviando imagem para análise...");
      const result = await analyzePlantImage(base64Image);
      
      console.log("Resposta da Plant.id:", result);
      
      // Processar a resposta
      const health = result.health_assessment;
      const disease = health?.diseases?.[0];
      
      if (disease) {
        const nome = disease.name?.pt || disease.name?.en || "Doença desconhecida";
        const confianca = disease.probability ? Math.round(disease.probability * 100) : 0;
        const descricao = disease.description?.pt || disease.description?.en || "";
        setResultado(`${nome} (${confianca}% de certeza)\n${descricao}`);
      } else if (health?.is_healthy) {
        setResultado("✓ Planta aparentemente saudável. Não foram detectados sinais de doenças.");
      } else {
        setResultado("⚠️ Nenhuma doença detectada ou diagnóstico inconclusivo.");
      }
      
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
            showTips={showTips}
            setShowTips={setShowTips}
          />
        </div>
      )}

      {preview && (
        <Card className="w-full max-w-md mb-6 shadow-md animate-fade-in">
          <CardContent className="p-4">
            <ImagePreview 
              imagePreview={preview}
              resetDiagnosis={resetDiagnosis}
              startAnalysis={analisar}
              isLoading={loading}
            />
          </CardContent>
        </Card>
      )}

      {resultado && !loading && (
        <div className="w-full max-w-md animate-fade-in">
          <ResultCard resultado={resultado} />
        </div>
      )}
    </div>
  );
};
