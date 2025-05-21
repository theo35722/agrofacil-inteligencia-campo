
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun } from "lucide-react";

interface WeatherPreviewErrorProps {
  onRetry: () => void;
}

export const WeatherPreviewError = ({ onRetry }: WeatherPreviewErrorProps) => {
  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-agro-green-800 flex justify-between items-center">
          <span>Previsão do Tempo</span>
          <CloudSun className="h-5 w-5 text-agro-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4">
          <p className="text-gray-600 text-center mb-3">Não foi possível obter a previsão do tempo.</p>
          <button 
            className="bg-agro-blue-50 border border-agro-blue-200 text-agro-blue-600 px-3 py-1 rounded-md text-sm flex items-center"
            onClick={onRetry}
          >
            <CloudSun className="h-4 w-4 mr-1" /> Tentar novamente
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
