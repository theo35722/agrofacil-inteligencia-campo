
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, MapPin } from "lucide-react";

interface WeatherCardHeaderProps {
  locationName: string | null;
}

export const WeatherCardHeader: React.FC<WeatherCardHeaderProps> = ({ locationName }) => {
  return (
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium flex items-center justify-between">
        <span>Previsão do Tempo</span>
        <CloudSun className="h-5 w-5 text-blue-500" />
      </CardTitle>
      {locationName && (
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{locationName}</span>
        </div>
      )}
    </CardHeader>
  );
};
