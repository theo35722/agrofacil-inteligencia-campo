
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const WeatherPreviewLoading = () => {
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
          <div className="flex flex-col items-center justify-center py-3">
            <Loader2 className="h-6 w-6 text-agro-blue-500 animate-spin mb-2" />
            <p className="text-xs text-gray-600">Carregando...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
