
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Loader2 } from "lucide-react";

export const WeatherPreviewLoading = () => {
  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-agro-green-800 flex justify-between items-center">
          <span>Previsão do Tempo</span>
          <CloudSun className="h-5 w-5 text-agro-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-8 w-8 text-agro-blue-500 animate-spin mb-3" />
          <p className="text-sm text-gray-600">Carregando previsão do tempo...</p>
        </div>
      </CardContent>
    </Card>
  );
};
