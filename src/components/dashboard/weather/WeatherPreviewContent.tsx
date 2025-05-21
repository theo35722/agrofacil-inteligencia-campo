
import React from "react";
import { CloudRain, Wind, Droplet } from "lucide-react";
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
      <div className="mb-1">
        <span className="text-xs text-gray-600">{locationName}</span>
      </div>
      
      {/* Current weather - more compact display */}
      <div className="mb-2">
        <div className="flex items-center">
          <span className="text-2xl font-semibold mr-2">{currentWeather.temperature}</span>
          <span className="text-gray-700 text-xs">{currentWeather.description}</span>
        </div>
      </div>
      
      {/* Weather metrics if enabled - more compact layout */}
      {showMetrics && (
        <div className="mb-2 grid grid-cols-3 gap-1 text-xs text-gray-700">
          {currentWeather.humidity !== undefined && (
            <div className="flex items-center">
              <Droplet className="h-3 w-3 text-agro-blue-400 mr-1" />
              <span>{currentWeather.humidity}%</span>
            </div>
          )}
          
          {currentWeather.rainChance !== undefined && (
            <div className="flex items-center">
              <CloudRain className="h-3 w-3 text-agro-blue-500 mr-1" />
              <span>{currentWeather.rainChance}%</span>
            </div>
          )}
          
          {currentWeather.wind !== undefined && (
            <div className="flex items-center">
              <Wind className="h-3 w-3 text-gray-500 mr-1" />
              <span>{currentWeather.wind}km/h</span>
            </div>
          )}
        </div>
      )}
      
      {/* Recommendation banner - compact version */}
      {recommendation && (
        <div className="bg-yellow-50 text-yellow-800 rounded text-xs p-1.5">
          <p className="line-clamp-2">{recommendation}</p>
        </div>
      )}
    </div>
  );
};
