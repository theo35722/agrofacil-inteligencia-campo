
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudSun } from "lucide-react";
import { WeatherIcon } from "@/components/weather/WeatherIcon";

interface WeatherCardErrorProps {
  onRetry: () => void;
}

export const WeatherCardError: React.FC<WeatherCardErrorProps> = ({ onRetry }) => {
  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-agro-green-800 flex justify-between items-center">
          <span>Previsão do Tempo</span>
          <CloudSun className="h-5 w-5 text-agro-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">N/A</p>
            <p className="text-sm text-gray-500">Dados indisponíveis</p>
            <p className="text-sm text-gray-500">Amanhã: -- / --</p>
          </div>
          <div className="h-12 w-12 text-gray-300">
            <WeatherIcon icon="cloud" className="h-12 w-12" />
          </div>
        </div>
        <div className="mt-2">
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
          >
            Tentar novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
