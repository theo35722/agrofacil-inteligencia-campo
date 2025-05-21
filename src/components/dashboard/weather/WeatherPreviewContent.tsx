
import React from "react";
import { CloudSun } from "lucide-react";

interface CurrentWeather {
  temperature: string;
  description: string;
  icon: string;
  humidity?: number;
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
  showMetrics = false
}) => {
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
          <span className="text-gray-700">{currentWeather.description}</span>
        </div>
      </div>
      
      {/* Weather metrics if enabled */}
      {showMetrics && currentWeather.humidity !== undefined && (
        <div className="mb-4 grid grid-cols-1 gap-2 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <span className="font-medium">Umidade:</span>
            <span>{currentWeather.humidity}%</span>
          </div>
        </div>
      )}
      
      {/* Recommendation banner if available - with yellow background */}
      {recommendation && (
        <div className="bg-yellow-50 text-yellow-800 text-sm p-2 rounded-md">
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
};
