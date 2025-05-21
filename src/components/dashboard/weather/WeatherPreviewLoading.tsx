
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const WeatherPreviewLoading = () => {
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
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 text-agro-blue-500 animate-spin mb-3" />
            <p className="text-sm text-gray-600">Carregando...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
