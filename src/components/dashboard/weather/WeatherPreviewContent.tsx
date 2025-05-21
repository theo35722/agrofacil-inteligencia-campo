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
  return <div className="animate-fade-in">
      {/* Location */}
      <div className="mb-2">
        <span className="text-sm text-gray-600">{locationName}</span>
      </div>
      
      {/* Current weather - larger display */}
      <div className="mb-3">
        <div className="flex items-center">
          <span className="text-3xl font-semibold mr-2">{currentWeather.temperature}</span>
          <span className="text-gray-700 text-sm py-0 mx-[50px] px-[6px] text-left">{currentWeather.description}</span>
        </div>
      </div>
      
      {/* Weather metrics if enabled - improved layout */}
      {showMetrics && <div className="mb-3 grid grid-cols-3 gap-2 text-sm text-gray-700">
          {currentWeather.humidity !== undefined && <div className="flex items-center">
              <Droplet className="h-4 w-4 text-agro-blue-400 mr-1" />
              <span>{currentWeather.humidity}%</span>
            </div>}
          
          {currentWeather.rainChance !== undefined && <div className="flex items-center">
              <CloudRain className="h-4 w-4 text-agro-blue-500 mr-1" />
              <span>{currentWeather.rainChance}%</span>
            </div>}
          
          {currentWeather.wind !== undefined && <div className="flex items-center">
              <Wind className="h-4 w-4 text-gray-500 mr-1" />
              <span>{currentWeather.wind}km/h</span>
            </div>}
        </div>}
      
      {/* Recommendation banner - more prominent */}
      {recommendation && <div className="bg-yellow-50 text-yellow-800 rounded p-2.5 border border-yellow-100">
          <p className="text-sm">{recommendation}</p>
        </div>}
    </div>;
};