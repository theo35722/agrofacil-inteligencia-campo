
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, ImageIcon, LoaderCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { analyzePlantImage, getDetailedDiagnosis, DiseaseDiagnosis } from "@/services/plantnet-api";
import { DiagnosisResult } from "@/components/plant-diagnosis/DiagnosisResult";
import { ImagePreview } from "@/components/plant-diagnosis/ImagePreview";

export default function AnalisePlantas() {
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
  const [resultado, setResultado] = useState<string | null>(null);
  const [detailedDiagnosis, setDetailedDiagnosis] = useState<DiseaseDiagnosis | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResultado(null);
      setDetailedDiagnosis(null);
      console.log("Arquivo carregado:", file.name);
    }
  };

  const resetDiagnosis = () => {
    setImage(null);
    setPreview(null);
    setResultado(null);
    setDetailedDiagnosis(null);
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
      
      console.log("Resposta completa da Plant.id:", result);
      
      // Processar o diagnóstico detalhado
      const diagnosis = getDetailedDiagnosis(result);
      setDetailedDiagnosis(diagnosis);
      
      // Criar resumo do diagnóstico para exibir
      if (diagnosis.disease === "Planta Saudável") {
        setResultado(`✅ Nenhuma doença detectada. Sua planta parece saudável.`);
      } else {
        setResultado(`${diagnosis.disease} (${diagnosis.confidence}% de certeza)\n${diagnosis.symptoms.join(". ")}`);
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-100 to-white px-6 py-12">
      <h1 className="text-3xl font-bold text-green-800 mb-2">Análise de Plantas</h1>
      <p className="text-center text-green-700 max-w-xl mb-6">
        Envie uma foto da sua planta para analisarmos a saúde dela com inteligência artificial.
      </p>

      {!preview && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="upload"
          />
          <label htmlFor="upload">
            <Button className="mb-4" variant="secondary">
              <UploadCloud className="mr-2 h-4 w-4" />
              Enviar Imagem
            </Button>
          </label>
        </>
      )}

      {preview && !detailedDiagnosis && (
        <Card className="w-full max-w-md mb-6 shadow-lg">
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
        <div className="text-green-700 flex items-center gap-2">
          <LoaderCircle className="animate-spin" />
          Analisando imagem...
        </div>
      )}

      {resultado && !loading && (
        <div className="mt-6 max-w-3xl w-full">
          {detailedDiagnosis && (
            <DiagnosisResult 
              imagePreview={preview!}
              diagnosisResult={detailedDiagnosis}
              resetDiagnosis={resetDiagnosis}
            />
          )}
        </div>
      )}
    </div>
  );
}
