
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

interface ImagePreviewProps {
  preview: string;
  onCancel: () => void;
  onAnalyze: () => void;
  loading: boolean;
}

export default function ImagePreview({
  preview,
  onCancel,
  onAnalyze,
  loading,
}: ImagePreviewProps) {
  // Função para enviar a imagem para o webhook
  const enviarImagemParaWebhook = async () => {
    try {
      // URL do webhook
      const webhookUrl = "https://hook.us2.make.com/trgfvdersyeosj0gu61p98hle6ffuzd6";
      
      // Preparar os dados para envio
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          imagem: preview,
          timestamp: new Date().toISOString() 
        }),
      });
      
      if (!response.ok) {
        console.error("Erro ao enviar imagem para o webhook:", response.statusText);
      } else {
        console.log("Imagem enviada para o webhook com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao enviar imagem para o webhook:", error);
    }
    
    // Continua com o fluxo normal de análise
    onAnalyze();
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-6 flex flex-col items-center gap-4">
      <img
        src={preview}
        alt="Pré-visualização da planta"
        className="rounded-lg shadow-md w-full"
      />

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={enviarImagemParaWebhook} disabled={loading}>
          {loading ? (
            <>
              <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
              Analisando...
            </>
          ) : (
            "Analisar"
          )}
        </Button>
      </div>
    </div>
  );
}
