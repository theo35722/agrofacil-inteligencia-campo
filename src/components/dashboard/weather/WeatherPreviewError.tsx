
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
      <Card className={`hover:shadow-md transition-shadow rounded-lg shadow-md ${isMobile ? 'max-w-[85%] mx-auto' : 'w-full'}`}>
        <CardHeader className="pb-1 p-3">
          <CardTitle className="text-agro-green-800 flex justify-between items-center text-base">
            <span>Previsão do Tempo</span>
            <CloudSun className="h-4 w-4 text-agro-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex flex-col items-center justify-center py-2">
            <p className="text-gray-600 text-xs text-center mb-2">Não foi possível obter a previsão.</p>
            <button 
              className="bg-agro-blue-50 border border-agro-blue-200 text-agro-blue-600 px-2 py-1 rounded text-xs flex items-center"
              onClick={onRetry}
            >
              <CloudSun className="h-3 w-3 mr-1" /> Tentar novamente
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
