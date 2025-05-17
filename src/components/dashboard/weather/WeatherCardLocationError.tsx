
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun } from "lucide-react";

export const WeatherCardLocationError: React.FC = () => {
  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-agro-green-800 flex justify-between items-center">
          <span>Previsão do Tempo</span>
          <CloudSun className="h-5 w-5 text-agro-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-amber-600">
          <p>Erro ao obter localização</p>
          <p className="text-sm mt-1">Verifique as permissões de localização</p>
        </div>
      </CardContent>
    </Card>
  );
};
