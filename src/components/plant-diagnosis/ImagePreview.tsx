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
        <Button onClick={onAnalyze} disabled={loading}>
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
