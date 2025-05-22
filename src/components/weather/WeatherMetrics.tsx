
import { CloudRain, Wind, Droplet, Thermometer } from "lucide-react";
import { formatRainChance } from "@/utils/weather-utils";

interface WeatherMetricsProps {
  rainChance: number;
  wind: number;
  humidity: number;
  uvIndex?: number;
  compact?: boolean;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ 
  rainChance, 
  wind, 
  humidity, 
  uvIndex,
  compact = false 
}) => {
  const getColorByRainChance = (chance: number) => {
    if (chance >= 70) return "text-agro-blue-600";
    if (chance >= 30) return "text-agro-blue-400";
    return "text-gray-400";
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <div className="flex items-center">
          <CloudRain className={`h-5 w-5 mr-2 ${getColorByRainChance(rainChance)}`} />
          <span>{formatRainChance(rainChance)}</span>
        </div>
        <div className="flex items-center">
          <Wind className="h-5 w-5 mr-2 text-gray-400" />
          <span>{wind} km/h</span>
        </div>
        <div className="flex items-center">
          <Droplet className="h-5 w-5 mr-2 text-agro-blue-300" />
          <span>{humidity}% umidade</span>
        </div>
        {uvIndex !== undefined && (
          <div className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-red-400" />
            <span>UV {uvIndex}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex flex-col items-center">
        <CloudRain className={`h-6 w-6 mb-1 ${getColorByRainChance(rainChance)}`} />
        <span className="text-sm text-gray-500">Chuva</span>
        <span className="font-medium">{formatRainChance(rainChance)}</span>
      </div>
      <div className="flex flex-col items-center">
        <Wind className="h-6 w-6 mb-1 text-gray-400" />
        <span className="text-sm text-gray-500">Vento</span>
        <span className="font-medium">{wind} km/h</span>
      </div>
      <div className="flex flex-col items-center">
        <Droplet className="h-6 w-6 mb-1 text-agro-blue-300" />
        <span className="text-sm text-gray-500">Umidade</span>
        <span className="font-medium">{humidity}%</span>
      </div>
      {uvIndex !== undefined && (
        <div className="flex flex-col items-center">
          <Thermometer className="h-6 w-6 mb-1 text-red-400" />
          <span className="text-sm text-gray-500">UV</span>
          <span className="font-medium">{uvIndex}</span>
        </div>
      )}
    </div>
  );
};
