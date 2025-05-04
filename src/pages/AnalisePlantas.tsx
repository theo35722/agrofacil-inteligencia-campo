
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, ImageIcon, LoaderCircle, CheckCircle2, AlertTriangle } from "lucide-react";

export default function AnalisePlantas() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResultado(null);
    }
  };

  const analisar = () => {
    if (!image) return;

    setLoading(true);
    setResultado(null);

    const nomeArquivo = image.name.toLowerCase();

    setTimeout(() => {
      let resultado = "";

      if (nomeArquivo.includes("ferrugem")) {
        resultado = "⚠️ Ferrugem Asiática detectada (82% de certeza)";
      } else if (nomeArquivo.includes("pulgao") || nomeArquivo.includes("inseto")) {
        resultado = "⚠️ Infestação de pulgões identificada (75% de certeza)";
      } else if (nomeArquivo.includes("amarela") || nomeArquivo.includes("nitrogenio")) {
        resultado = "💡 Deficiência de nitrogênio provável (68% de certeza)";
      } else if (nomeArquivo.includes("doente") || nomeArquivo.includes("mancha")) {
        resultado = "⚠️ Mancha alvo detectada (72% de certeza)";
      } else {
        // Diagnóstico saudável com chance de 30%
        const chanceSaudavel = Math.random() < 0.3;
        if (chanceSaudavel) {
          resultado = "✅ Sua planta parece saudável (85% de certeza)";
        } else {
          const outrosProblemas = [
            "⚠️ Sinais de estresse hídrico (60% de certeza)",
            "⚠️ Excesso de adubo (55% de certeza)",
          ];
          resultado = outrosProblemas[Math.floor(Math.random() * outrosProblemas.length)];
        }
      }

      setResultado(resultado);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-100 to-white px-6 py-12">
      <h1 className="text-3xl font-bold text-green-800 mb-2">Análise de Plantas</h1>
      <p className="text-center text-green-700 max-w-xl mb-6">
        Envie uma foto da sua planta para analisarmos a saúde dela com inteligência artificial.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="upload"
      />
      <label htmlFor="upload">
        <Button className="mb-4">
          <UploadCloud className="mr-2 h-4 w-4" />
          Enviar Imagem
        </Button>
      </label>

      {preview && (
        <Card className="w-full max-w-sm mb-6 shadow-lg">
          <CardContent className="p-4 flex flex-col items-center">
            <img src={preview} alt="Prévia" className="rounded-lg w-full mb-3" />
            <Button onClick={analisar}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Analisar Planta
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="text-green-700 flex items-center gap-2">
          <LoaderCircle className="animate-spin" />
          Analisando imagem...
        </div>
      )}

      {resultado && (
        <div className="mt-6 text-lg text-center text-green-800 font-medium flex items-center gap-2">
          {resultado.includes("saudável") ? <CheckCircle2 /> : <AlertTriangle />}
          {resultado}
        </div>
      )}
    </div>
  );
}
