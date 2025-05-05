
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, ImageIcon, LoaderCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { analyzePlantImage } from "@/services/plantnet-api";

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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResultado(null);
      
      // Log para depuração - confirma que temos acesso ao nome do arquivo
      console.log("Arquivo carregado:", file.name);
    }
  };

  const analisar = async () => {
    if (!image) {
      toast.error("Nenhuma imagem foi enviada para análise.");
      return;
    }

    try {
      setLoading(true);
      setResultado(null);

      // Armazena e loga o nome do arquivo para confirmar que está sendo lido corretamente
      const nomeArquivo = image.name.toLowerCase();
      console.log("Nome do arquivo para análise:", nomeArquivo);

      // Decidir se usamos a API real ou simulamos a análise baseada no nome do arquivo
      // Para este exemplo, vamos simular baseado no nome do arquivo
      // Em um ambiente de produção, você iria comentar este bloco e descomentar o bloco da API real

     
     

      // Para usar a API real descomente este bloco e comente o bloco acima
      
      // Converter imagem para base64
      const base64Image = await toBase64(image);

      // Chamar a IA real (Plant.id)
      const result = await analyzePlantImage(base64Image);

      // Pegar a primeira doença identificada
      const health = result.health_assessment;
      const disease = health?.diseases?.[0];

      if (disease) {
        const nome = disease.name?.pt || disease.name?.en || "Doença desconhecida";
        const confianca = disease.probability ? Math.round(disease.probability * 100) : 0;
        const descricao = disease.description?.pt || disease.description?.en || "";

        setResultado(`${nome} (${confianca}% de certeza)\n${descricao}`);
      } else {
        setResultado("⚠️ Nenhuma doença detectada ou diagnóstico inconclusivo.");
      }
      
      setLoading(false);
      toast.success("Análise concluída com sucesso!");
      
    } catch (error) {
      console.error("Erro ao analisar planta:", error);
      toast.error("Erro ao analisar a planta.");
      setLoading(false);
    }
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
        <Button className="mb-4" variant="secondary">
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
