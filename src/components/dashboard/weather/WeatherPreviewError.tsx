
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface WeatherPreviewErrorProps {
  onRetry: () => void;
}

export const WeatherPreviewError = ({ onRetry }: WeatherPreviewErrorProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-center">
      <Card className={`hover:shadow-md transition-shadow rounded-lg shadow-md ${isMobile ? 'max-w-[90%] mx-auto' : 'w-full'}`}>
        <CardHeader className="pb-2 p-4">
          <CardTitle className="text-agro-green-800 flex justify-between items-center text-lg">
            <span>Previsão do Tempo</span>
            <CloudSun className="h-5 w-5 text-agro-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-col items-center justify-center py-3">
            <p className="text-gray-600 text-sm text-center mb-3">Não foi possível obter a previsão.</p>
            <button 
              className="bg-agro-blue-50 border border-agro-blue-200 text-agro-blue-600 px-3 py-1.5 rounded text-sm flex items-center"
              onClick={onRetry}
            >
              <CloudSun className="h-4 w-4 mr-1.5" /> Tentar novamente
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
