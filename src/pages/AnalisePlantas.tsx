
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { analyzePlantImage } from "@/services/plantnet-api";
import ImageUploadArea from "@/components/plant-diagnosis/ImageUploadArea";
import ImagePreview from "@/components/plant-diagnosis/ImagePreview";
import ResultCard from "@/components/plant-diagnosis/ResultCard";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AnalisePlantas() {
  const isMobile = useIsMobile();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [showTips, setShowTips] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResultado(null);
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });

  const handleAnalyze = async () => {
    if (!image) {
      toast.error("Envie uma imagem antes de analisar.");
      return;
    }

    try {
      setLoading(true);
      const base64Image = await toBase64(image);
      const result = await analyzePlantImage(base64Image);
      setResultado(result);
      toast.success("Análise concluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao analisar a imagem.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-12 md:py-10 bg-gradient-to-br from-green-50 to-white">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 text-center">
        Diagnóstico de Planta
      </h1>

      <ImageUploadArea
        captureImage={() => document.getElementById("fileInput")?.click()}
        handleImageUpload={handleImageUpload}
        showTips={showTips}
        setShowTips={setShowTips}
      />

      {preview && (
        <ImagePreview
          preview={preview}
          onCancel={() => {
            setImage(null);
            setPreview(null);
            setResultado(null);
          }}
          onAnalyze={handleAnalyze}
          loading={loading}
        />
      )}

      {resultado && (
        <div className="mt-6 animate-fade-in">
          <ResultCard result={resultado} />
        </div>
      )}

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
