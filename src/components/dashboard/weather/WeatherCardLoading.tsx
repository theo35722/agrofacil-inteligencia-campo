
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun } from "lucide-react";
import { WeatherLoading } from "@/components/weather/WeatherLoading";

export const WeatherCardLoading: React.FC = () => {
  return (
    <Card className="agro-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-agro-green-800 flex justify-between items-center">
          <span>Previsão do Tempo</span>
          <CloudSun className="h-5 w-5 text-agro-blue-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WeatherLoading simplified />
      </CardContent>
    </Card>
  );
};
