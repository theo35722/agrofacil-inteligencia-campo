
import React from "react";
import { CloudSun, CloudRain, Wind, Droplet } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CurrentWeather {
  temperature: string;
  description: string;
  icon: string;
  humidity?: number;
  wind?: number;
  rainChance?: number;
}

interface WeatherPreviewContentProps {
  currentWeather: CurrentWeather;
  locationName: string;
  recommendation?: string;
  showMetrics?: boolean;
}

export const WeatherPreviewContent: React.FC<WeatherPreviewContentProps> = ({
  currentWeather,
  locationName,
  recommendation,
  showMetrics = true
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="animate-fade-in">
      {/* Location */}
      <div className="mb-2">
        <span className="text-sm text-gray-600">{locationName}</span>
      </div>
      
      {/* Current weather - larger temperature display */}
      <div className="mb-4">
        <div className="flex items-center">
          <span className="text-4xl font-semibold mr-2">{currentWeather.temperature}</span>
          <span className="text-gray-700 text-sm">{currentWeather.description}</span>
        </div>
      </div>
      
      {/* Weather metrics if enabled */}
      {showMetrics && (
        <div className="mb-4 grid grid-cols-1 gap-2 text-sm text-gray-700">
          {currentWeather.humidity !== undefined && (
            <div className="flex items-center gap-1">
              <Droplet className="h-4 w-4 text-agro-blue-400 mr-1" />
              <span className="font-medium">Umidade:</span>
              <span>{currentWeather.humidity}%</span>
            </div>
          )}
          
          {currentWeather.rainChance !== undefined && (
            <div className="flex items-center gap-1">
              <CloudRain className="h-4 w-4 text-agro-blue-500 mr-1" />
              <span className="font-medium">Chance de chuva:</span>
              <span>{currentWeather.rainChance}%</span>
            </div>
          )}
          
          {currentWeather.wind !== undefined && (
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4 text-gray-500 mr-1" />
              <span className="font-medium">Vento:</span>
              <span>{currentWeather.wind} km/h</span>
            </div>
          )}
        </div>
      )}
      
      {/* Recommendation banner if available - with improved mobile styling */}
      {recommendation && (
        <div className="bg-yellow-50 text-yellow-800 text-sm p-2 rounded-md">
          <p className="text-xs md:text-sm">{recommendation}</p>
        </div>
      )}
    </div>
  );
};
